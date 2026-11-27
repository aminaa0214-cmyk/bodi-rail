import { inquiryForms, type InquiryKind } from "@/lib/inquiry";

/** Маягтаар ирсэн хүсэлтийн төлөв (inquiries.status) */
export const INQUIRY_STATUSES = [
  { value: "new", label: "Шинэ", className: "bg-sky text-blue-dark" },
  { value: "contacted", label: "Холбогдсон", className: "bg-[#fff4e0] text-[#9a5b00]" },
  { value: "closed", label: "Шийдвэрлэсэн", className: "bg-[#e5f6ea] text-[#1b7a3a]" },
] as const;

export function inquiryStatus(value: string) {
  return INQUIRY_STATUSES.find((s) => s.value === value) ?? INQUIRY_STATUSES[0];
}

/** Хүсэлтийн төрөл: аль маягтаас ирсэн */
export const INQUIRY_KINDS: { value: InquiryKind; label: string }[] = [
  { value: "service", label: "Түрээс, үйлчилгээ" },
  { value: "quote", label: "Худалдаа (үнийн санал)" },
  { value: "order", label: "Тээврийн захиалга" },
];

export function inquiryKindLabel(kind: string) {
  return INQUIRY_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

/** Талбарын нэрийг маягтын шошгоор харуулна */
export function inquiryFieldLabel(kind: string, field: string) {
  const fields = inquiryForms[kind as InquiryKind]?.fields as Record<string, string> | undefined;
  return fields?.[field] ?? field;
}

export type InquiryRow = {
  id: string;
  created_at: string;
  kind: InquiryKind;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  answers: Record<string, string>;
  emailed: boolean;
  status: (typeof INQUIRY_STATUSES)[number]["value"];
  note: string | null;
};
