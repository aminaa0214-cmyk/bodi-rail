"use server";

import { Resend } from "resend";
import { contact } from "@/content/site";
import { getJobs } from "@/lib/data";
import { HONEYPOT_FIELD } from "@/lib/inquiry";
import { insertRow, isSupabaseConfigured, uploadFile } from "@/lib/supabase";
import {
  ACCEPTED_TYPES,
  CONSENT_FIELDS,
  MAX_TOTAL_BYTES,
  MAX_TOTAL_LABEL,
  REGISTER_PATTERN,
  applicationFiles,
  applicationParts,
  groupFieldName,
  type ApplicationResult,
} from "@/lib/application";

const MAX_LENGTH = 5000;
const MAX_ROWS = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_RE = new RegExp(`^${REGISTER_PATTERN}$`);
const BUCKET = "applications";
const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "application/pdf": "pdf" };

type Attachment = { field: string; label: string; file: File };

/**
 * Онлайн анкетыг Supabase-д хадгалж (applications хүснэгт + "applications" bucket),
 * хавсралт файлуудтай нь хүний нөөцийн и-мэйл рүү илгээнэ.
 * Аль нэг нь амжилттай болбол анкетыг хүлээн авсанд тооцно.
 */
export async function sendApplication(formData: FormData): Promise<ApplicationResult> {
  // Спам бот: амжилттай мэт хариулаад юу ч илгээхгүй
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
    return { status: "success", message: "Таны анкетыг хүлээн авлаа. Баярлалаа!" };
  }

  const text = (name: string) => String(formData.get(name) ?? "").trim().slice(0, MAX_LENGTH);
  const position = text("position_1");
  const job = isSupabaseConfigured() ? (await getJobs()).find((j) => j.title === position) : undefined;

  // ---------- Заавал бөглөх талбар ----------
  const missing: string[] = [];
  for (const part of applicationParts) {
    for (const item of part.items) {
      if (item.kind !== "fields") continue;
      for (const field of item.fields) {
        if (field.required && !text(field.name)) missing.push(field.label);
      }
    }
  }
  if (job?.requiresDriverLicense && formData.getAll("license_class").length === 0) {
    missing.push("Жолооны үнэмлэхний ангилал");
  }
  for (const name of Object.keys(CONSENT_FIELDS)) {
    if (!formData.get(name)) missing.push("Баталгаажуулалт");
  }
  if (!text("signature")) missing.push("Өргөдөл гаргагчийн овог нэр");
  if (missing.length > 0) {
    return { status: "error", message: `Дараах талбарыг бөглөнө үү: ${[...new Set(missing)].join(", ")}.` };
  }

  if (!REGISTER_RE.test(text("register_no"))) {
    return { status: "error", message: "Регистрийн дугаар 2 үсэг, 8 тооноос бүрдэнэ (жишээ нь АА00000000)." };
  }
  if (!EMAIL_RE.test(text("email"))) {
    return { status: "error", message: "Имэйл хаяг буруу байна." };
  }

  // ---------- Хавсралт ----------
  const attachments: Attachment[] = [];
  let total = 0;
  for (const def of applicationFiles) {
    const files = formData.getAll(def.name).filter((v): v is File => v instanceof File && v.size > 0);
    const required = def.required === "always" || (def.required === "rail" && job?.requiresRailDocuments);
    if (required && files.length === 0) {
      return { status: "error", message: `“${def.label}” файлыг хавсаргана уу.` };
    }
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type) || (def.imageOnly && !file.type.startsWith("image/"))) {
        return { status: "error", message: `“${file.name}” файлын төрөл буруу байна. JPG, PNG эсвэл PDF хавсаргана уу.` };
      }
      total += file.size;
      attachments.push({ field: def.name, label: def.label, file });
    }
  }
  if (total > MAX_TOTAL_BYTES) {
    return { status: "error", message: `Хавсралтын нийт хэмжээ ${MAX_TOTAL_LABEL}-аас их байна.` };
  }

  // ---------- Хариултууд: өгөгдлийн санд JSON, и-мэйлд текст ----------
  const answers: Record<string, unknown> = {};
  const lines: string[] = [];
  for (const part of applicationParts) {
    const partLines: string[] = [];
    for (const item of part.items) {
      if (item.kind === "fields") {
        for (const field of item.fields) {
          const value = text(field.name);
          if (!value) continue;
          answers[field.name] = value;
          partLines.push(`${field.label}: ${value}`);
        }
      } else if (item.kind === "choice") {
        const values = formData.getAll(item.choice.name).map(String).filter(Boolean);
        if (!values.length) continue;
        answers[item.choice.name] = values;
        partLines.push(`${item.title ?? item.choice.label}: ${values.join(", ")}`);
      } else {
        const { group } = item;
        const rows: Record<string, string>[] = [];
        for (let i = 0; i < MAX_ROWS; i++) {
          const row = group.fields
            .map((field) => [field, text(groupFieldName(group.key, i, field.name))] as const)
            .filter(([, value]) => value);
          if (row.length === 0) continue;
          rows.push(Object.fromEntries(row.map(([field, value]) => [field.name, value])));
          partLines.push(`${group.title} #${rows.length}`);
          for (const [field, value] of row) partLines.push(`   ${field.label}: ${value}`);
        }
        if (rows.length) answers[group.key] = rows;
      }
    }
    if (partLines.length) lines.push(`\n== ${part.legend} ==`, ...partLines);
  }
  answers.signature = text("signature");
  answers.submitted_date = text("submitted_date");
  answers.consent = true;
  answers.privacy_consent = true;

  lines.push(
    "\n== Баталгаажуулалт ==",
    "Мэдээллийг тодруулах, үнэн зөв байх: зөвшөөрсөн",
    "Хувийн мэдээлэл боловсруулах: зөвшөөрсөн",
    `Өргөдөл гаргагч: ${text("signature")}`,
    `Огноо: ${text("submitted_date")}`,
    `\nХавсралт: ${attachments.map((a) => `${a.label} - ${a.file.name}`).join("; ")}`,
  );

  const fullName = `${text("last_name")} ${text("first_name")}`.trim();
  const subject = `Анкет: ${position} — ${fullName}`;

  // ---------- 1. Supabase-д хадгалах ----------
  const id = crypto.randomUUID();
  let saved = false;
  if (isSupabaseConfigured()) {
    try {
      const files = [];
      for (const [index, { field, label, file }] of attachments.entries()) {
        // Storage-ийн замд кирилл үсэг зөвшөөрөгддөггүй тул файлын нэрийг ашиглахгүй
        const path = `${id}/${String(index + 1).padStart(2, "0")}-${field}.${EXTENSIONS[file.type] ?? "bin"}`;
        await uploadFile(BUCKET, path, file, file.type);
        files.push({ field, label, path, original_name: file.name, size: file.size, type: file.type });
      }
      await insertRow("applications", {
        id,
        position,
        full_name: fullName,
        email: text("email"),
        phone: text("phone"),
        register_no: text("register_no"),
        answers,
        files,
      });
      saved = true;
    } catch (err) {
      console.error("[sendApplication] Supabase-д хадгалж чадсангүй:", err);
    }
  } else {
    console.warn("[sendApplication] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY тохируулаагүй тул анкетыг хадгалсангүй.");
  }

  // ---------- 2. И-мэйлээр илгээх ----------
  const body = [
    lines.join("\n").trim(),
    saved ? `\nАнкетын дугаар (Supabase → applications): ${id}` : "",
    "\n— bodirail.mn вэбсайтын онлайн анкетаас илгээгдэв.",
  ].join("\n");

  const emailed = await sendEmail(subject, body, text("email"), attachments);

  if (saved || emailed === "sent") {
    return { status: "success", message: "Таны анкет амжилттай илгээгдлээ. Баярлалаа! Бид тантай удахгүй холбогдох болно." };
  }
  if (emailed === "skipped" && process.env.NODE_ENV !== "production") {
    console.info(`[sendApplication] Хөгжүүлэлтийн горим, и-мэйлийн агуулга:\n${subject}\n${body}`);
    return { status: "success", message: "Хөгжүүлэлтийн горим: анкет хадгалагдсангүй, илгээгдсэнгүй, терминалд хэвлэлээ." };
  }
  return { status: "error", message: errorMessage() };
}

async function sendEmail(subject: string, body: string, replyTo: string, attachments: Attachment[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[sendApplication] RESEND_API_KEY тохируулаагүй тул и-мэйл илгээсэнгүй.");
    return "skipped" as const;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Бодь Рэйл вэбсайт <onboarding@resend.dev>",
    to: process.env.HR_TO_EMAIL || process.env.CONTACT_TO_EMAIL || contact.email,
    replyTo,
    subject,
    text: body,
    attachments: await Promise.all(
      attachments.map(async ({ label, file }) => ({
        filename: `${label} - ${file.name}`,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
      })),
    ),
  });

  if (error) {
    console.error("[sendApplication] Resend алдаа:", error);
    return "failed" as const;
  }
  return "sent" as const;
}

function errorMessage() {
  return `Анкет илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${contact.phone.display} утсаар, ${contact.email} хаягаар холбогдоно уу.`;
}
