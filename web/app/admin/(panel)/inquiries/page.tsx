import Link from "next/link";
import { AdminHeader, AdminList, AdminRow, Badge } from "@/components/admin/list";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { INQUIRY_KINDS, INQUIRY_STATUSES, inquiryKindLabel, inquiryStatus, type InquiryRow } from "@/lib/inquiry-status";

type Props = { searchParams: Promise<{ status?: string; kind?: string }> };

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const { status, kind } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("inquiries")
    .select("id, created_at, kind, name, company, phone, answers, emailed, status")
    .order("created_at", { ascending: false })
    .limit(500);
  if (status) query = query.eq("status", status);
  if (kind) query = query.eq("kind", kind);
  const { data } = await query;
  const rows = (data ?? []) as Omit<InquiryRow, "email" | "note">[];

  const { data: all } = await supabase.from("inquiries").select("kind, status");
  const statusCounts = new Map<string, number>();
  const kindCounts = new Map<string, number>();
  for (const row of (all ?? []) as { kind: string; status: string }[]) {
    statusCounts.set(row.status, (statusCounts.get(row.status) ?? 0) + 1);
    kindCounts.set(row.kind, (kindCounts.get(row.kind) ?? 0) + 1);
  }

  const href = (next: { status?: string; kind?: string }) => {
    const params = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    const k = "kind" in next ? next.kind : kind;
    if (s) params.set("status", s);
    if (k) params.set("kind", k);
    const qs = params.toString();
    return `/admin/inquiries${qs ? `?${qs}` : ""}`;
  };
  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold no-underline",
      active ? "border-blue bg-blue text-white hover:text-white" : "border-line bg-white text-navy",
    );

  return (
    <>
      <AdminHeader title="Ирсэн хүсэлт">
        <p className="text-sm text-muted">Түрээс, худалдаа, тээврийн захиалгын маягтаар ирсэн хүсэлтүүд. Шинэ нь эхэндээ.</p>
      </AdminHeader>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Link href={href({ status: undefined })} className={chip(!status)}>
            Бүгд ({all?.length ?? 0})
          </Link>
          {INQUIRY_STATUSES.map((s) => (
            <Link key={s.value} href={href({ status: s.value })} className={chip(status === s.value)}>
              {s.label} ({statusCounts.get(s.value) ?? 0})
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={href({ kind: undefined })} className={chip(!kind)}>
            Бүх төрөл
          </Link>
          {INQUIRY_KINDS.map((k) => (
            <Link key={k.value} href={href({ kind: k.value })} className={chip(kind === k.value)}>
              {k.label} ({kindCounts.get(k.value) ?? 0})
            </Link>
          ))}
        </div>
      </div>

      <AdminList empty="Хүсэлт алга.">
        {rows.map((row) => {
          const s = inquiryStatus(row.status);
          const subject = row.answers.service || row.answers.product || (row.answers.from && `${row.answers.from} → ${row.answers.to}`);
          return (
            <AdminRow
              key={row.id}
              title={
                <Link href={`/admin/inquiries/${row.id}`}>
                  {row.name}
                  {row.company && <span className="font-normal text-muted"> · {row.company}</span>}
                </Link>
              }
              meta={
                <>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", s.className)}>{s.label}</span>
                  {inquiryKindLabel(row.kind)}
                  {subject && ` · ${subject}`} · {dateFormat.format(new Date(row.created_at))} · {row.phone}
                  {!row.emailed && <Badge>И-мэйл очоогүй</Badge>}
                </>
              }
            >
              <Link href={`/admin/inquiries/${row.id}`} className="text-sm font-semibold text-blue-dark">
                Үзэх
              </Link>
            </AdminRow>
          );
        })}
      </AdminList>
    </>
  );
}
