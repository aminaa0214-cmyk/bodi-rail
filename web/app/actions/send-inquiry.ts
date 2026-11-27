"use server";

import { Resend } from "resend";
import { contact } from "@/content/site";
import { insertRow, isSupabaseConfigured } from "@/lib/supabase";
import {
  HONEYPOT_FIELD,
  inquiryForms,
  type InquiryFormConfig,
  type InquiryKind,
  type InquiryResult,
} from "@/lib/inquiry";

const MAX_LENGTH = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isKind(value: unknown): value is InquiryKind {
  return typeof value === "string" && Object.hasOwn(inquiryForms, value);
}

/**
 * Вэбсайтын маягтаас ирсэн хүсэлтийг info@bodirail.mn руу и-мэйлээр илгээж, Supabase-ийн inquiries хүснэгтэд хадгална.
 * Аль нэг нь амжилттай болбол хүсэлтийг хүлээн авсанд тооцно.
 */
export async function sendInquiry(formData: FormData): Promise<InquiryResult> {
  const kind = formData.get("kind");
  if (!isKind(kind)) {
    return { status: "error", message: "Маягт буруу байна. Хуудсаа шинэчлээд дахин оролдоно уу." };
  }

  // Спам бот: амжилттай мэт хариулаад юу ч илгээхгүй
  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
    return { status: "success", message: "Хүсэлтийг хүлээн авлаа. Баярлалаа!" };
  }

  const form: InquiryFormConfig = inquiryForms[kind];
  const values: Record<string, string> = {};
  for (const name of Object.keys(form.fields)) {
    values[name] = String(formData.get(name) ?? "").trim().slice(0, MAX_LENGTH);
  }

  const missing = form.required.filter((name) => !values[name]);
  if (missing.length > 0) {
    const labels = missing.map((name) => form.fields[name]).join(", ");
    return { status: "error", message: `Дараах талбарыг бөглөнө үү: ${labels}.` };
  }

  const replyTo = values.email || undefined;
  if (replyTo && !EMAIL_RE.test(replyTo)) {
    return { status: "error", message: "И-мэйл хаяг буруу байна." };
  }

  const lines = Object.entries(form.fields)
    .filter(([name]) => values[name])
    .map(([name, label]) => `${label}: ${values[name]}`);
  const subject = `${form.subject}: ${values.name}${values.company ? ` (${values.company})` : ""}`;
  const text = `${lines.join("\n")}\n\n— bodirail.mn вэбсайтын маягтаас илгээгдэв.`;

  const emailed = await sendEmail(subject, text, replyTo);

  // Supabase-д хадгална. И-мэйл илгээгдээгүй ч хүсэлт админ хуудсанд (/admin/inquiries) харагдана.
  let saved = false;
  if (isSupabaseConfigured()) {
    try {
      const answers = Object.fromEntries(Object.entries(values).filter(([, value]) => value));
      await insertRow("inquiries", {
        id: crypto.randomUUID(),
        kind,
        name: values.name,
        company: values.company || null,
        phone: values.phone,
        email: values.email || null,
        answers,
        emailed: emailed === "sent",
      });
      saved = true;
    } catch (err) {
      console.error("[sendInquiry] Supabase-д хадгалж чадсангүй:", err);
    }
  }

  if (saved || emailed === "sent") {
    return { status: "success", message: "Хүсэлтийг хүлээн авлаа. Манай мэргэжилтэн тантай удахгүй холбогдоно." };
  }
  if (emailed === "skipped" && process.env.NODE_ENV !== "production") {
    console.info(`[sendInquiry] Хөгжүүлэлтийн горим, и-мэйлийн агуулга:\n${subject}\n${text}`);
    return { status: "success", message: "Хөгжүүлэлтийн горим: хүсэлт хадгалагдсангүй, илгээгдсэнгүй, терминалд хэвлэлээ." };
  }
  return { status: "error", message: errorMessage() };
}

async function sendEmail(subject: string, text: string, replyTo: string | undefined) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[sendInquiry] RESEND_API_KEY тохируулаагүй тул и-мэйл илгээсэнгүй.");
    return "skipped" as const;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Бодь Рэйл вэбсайт <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL || contact.email,
    replyTo,
    subject,
    text,
  });

  if (error) {
    console.error("[sendInquiry] Resend алдаа:", error);
    return "failed" as const;
  }
  return "sent" as const;
}

function errorMessage() {
  return `Хүсэлт илгээхэд алдаа гарлаа. ${contact.phone.display} утсаар эсвэл ${contact.email} хаягаар холбогдоно уу.`;
}
