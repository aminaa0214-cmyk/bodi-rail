"use server";

import { Resend } from "resend";
import { contact } from "@/content/site";
import { DRIVER_POSITION, RAIL_POSITIONS } from "@/content/jobs";
import { HONEYPOT_FIELD } from "@/lib/inquiry";
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

/** Онлайн анкетыг хавсралт файлуудтай нь хүний нөөцийн и-мэйл рүү илгээнэ. */
export async function sendApplication(formData: FormData): Promise<ApplicationResult> {
  // Спам бот: амжилттай мэт хариулаад юу ч илгээхгүй
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
    return { status: "success", message: "Таны анкетыг хүлээн авлаа. Баярлалаа!" };
  }

  const text = (name: string) => String(formData.get(name) ?? "").trim().slice(0, MAX_LENGTH);
  const position = text("position_1");

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
  if (position === DRIVER_POSITION && formData.getAll("license_class").length === 0) {
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
  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  let total = 0;
  for (const def of applicationFiles) {
    const files = formData.getAll(def.name).filter((v): v is File => v instanceof File && v.size > 0);
    const required = def.required === "always" || (def.required === "rail" && RAIL_POSITIONS.includes(position));
    if (required && files.length === 0) {
      return { status: "error", message: `“${def.label}” файлыг хавсаргана уу.` };
    }
    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type) || (def.imageOnly && !file.type.startsWith("image/"))) {
        return { status: "error", message: `“${file.name}” файлын төрөл буруу байна. JPG, PNG эсвэл PDF хавсаргана уу.` };
      }
      total += file.size;
      attachments.push({
        filename: `${def.label} - ${file.name}`,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
      });
    }
  }
  if (total > MAX_TOTAL_BYTES) {
    return { status: "error", message: `Хавсралтын нийт хэмжээ ${MAX_TOTAL_LABEL}-аас их байна.` };
  }

  // ---------- И-мэйлийн агуулга ----------
  const lines: string[] = [];
  for (const part of applicationParts) {
    const partLines: string[] = [];
    for (const item of part.items) {
      if (item.kind === "fields") {
        for (const field of item.fields) {
          const value = text(field.name);
          if (value) partLines.push(`${field.label}: ${value}`);
        }
      } else if (item.kind === "choice") {
        const values = formData.getAll(item.choice.name).map(String).filter(Boolean);
        if (values.length) partLines.push(`${item.title ?? item.choice.label}: ${values.join(", ")}`);
      } else {
        const { group } = item;
        for (let i = 0; i < MAX_ROWS; i++) {
          const row = group.fields
            .map((field) => [field.label, text(groupFieldName(group.key, i, field.name))] as const)
            .filter(([, value]) => value);
          if (row.length === 0) continue;
          partLines.push(`${group.title} #${i + 1}`);
          for (const [label, value] of row) partLines.push(`   ${label}: ${value}`);
        }
      }
    }
    if (partLines.length) lines.push(`\n== ${part.legend} ==`, ...partLines);
  }
  lines.push(
    "\n== Баталгаажуулалт ==",
    "Мэдээллийг тодруулах, үнэн зөв байх: зөвшөөрсөн",
    "Хувийн мэдээлэл боловсруулах: зөвшөөрсөн",
    `Өргөдөл гаргагч: ${text("signature")}`,
    `Огноо: ${text("submitted_date")}`,
    `\nХавсралт: ${attachments.map((a) => a.filename).join("; ")}`,
  );

  const fullName = `${text("last_name")} ${text("first_name")}`.trim();
  const subject = `Анкет: ${position} — ${fullName}`;
  const body = `${lines.join("\n").trim()}\n\n— bodirail.mn вэбсайтын онлайн анкетаас илгээгдэв.`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Хөгжүүлэлтийн үед тохиргоогүй бол и-мэйлийн агуулгыг терминалд хэвлэнэ
    if (process.env.NODE_ENV !== "production") {
      console.info(`[sendApplication] RESEND_API_KEY тохируулаагүй тул илгээсэнгүй.\n${subject}\n${body}`);
      return { status: "success", message: "Хөгжүүлэлтийн горим: анкет илгээгээгүй, терминалд хэвлэлээ." };
    }
    console.error("[sendApplication] RESEND_API_KEY тохируулаагүй байна.");
    return { status: "error", message: errorMessage() };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Бодь Рэйл вэбсайт <onboarding@resend.dev>",
    to: process.env.HR_TO_EMAIL || process.env.CONTACT_TO_EMAIL || contact.email,
    replyTo: text("email"),
    subject,
    text: body,
    attachments,
  });

  if (error) {
    console.error("[sendApplication] Resend алдаа:", error);
    return { status: "error", message: errorMessage() };
  }

  return { status: "success", message: "Таны анкет амжилттай илгээгдлээ. Баярлалаа! Бид тантай удахгүй холбогдох болно." };
}

function errorMessage() {
  return `Анкет илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${contact.phone.display} утсаар, ${contact.email} хаягаар холбогдоно уу.`;
}
