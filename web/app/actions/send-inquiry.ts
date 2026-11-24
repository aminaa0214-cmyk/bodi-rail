"use server";

import { Resend } from "resend";
import { contact } from "@/content/site";
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

/** Вэбсайтын маягтаас ирсэн хүсэлтийг info@bodirail.mn руу и-мэйлээр илгээнэ. */
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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Хөгжүүлэлтийн үед тохиргоогүй бол и-мэйлийн агуулгыг терминалд хэвлэнэ
    if (process.env.NODE_ENV !== "production") {
      console.info(`[sendInquiry] RESEND_API_KEY тохируулаагүй тул илгээсэнгүй.\n${subject}\n${text}`);
      return { status: "success", message: "Хөгжүүлэлтийн горим: и-мэйл илгээгээгүй, терминалд хэвлэлээ." };
    }
    console.error("[sendInquiry] RESEND_API_KEY тохируулаагүй байна.");
    return { status: "error", message: errorMessage() };
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
    return { status: "error", message: errorMessage() };
  }

  return { status: "success", message: "Хүсэлтийг хүлээн авлаа. Манай мэргэжилтэн тантай удахгүй холбогдоно." };
}

function errorMessage() {
  return `Хүсэлт илгээхэд алдаа гарлаа. ${contact.phone.display} утсаар эсвэл ${contact.email} хаягаар холбогдоно уу.`;
}
