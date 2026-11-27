import Link from "next/link";
import { AdminHeader, AdminList, AdminRow } from "@/components/admin/list";
import { APPLICATION_STATUSES, statusInfo, type ApplicationRow } from "@/lib/application-status";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";

type Props = { searchParams: Promise<{ status?: string; position?: string }> };

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminApplicationsPage({ searchParams }: Props) {
  const { status, position } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("applications")
    .select("id, created_at, position, full_name, email, phone, status")
    .order("created_at", { ascending: false })
    .limit(500);
  if (status) query = query.eq("status", status);
  if (position) query = query.eq("position", position);
  const { data } = await query;
  const rows = (data ?? []) as Pick<ApplicationRow, "id" | "created_at" | "position" | "full_name" | "email" | "phone" | "status">[];

  // Шүүлтүүрийн сонголтод зориулж бүх албан тушаал, төлөв бүрийн тоо
  const { data: all } = await supabase.from("applications").select("position, status");
  const counts = new Map<string, number>();
  const positions = new Set<string>();
  for (const row of (all ?? []) as { position: string; status: string }[]) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
    positions.add(row.position);
  }

  const href = (next: { status?: string; position?: string }) => {
    const params = new URLSearchParams();
    const s = "status" in next ? next.status : status;
    const p = "position" in next ? next.position : position;
    if (s) params.set("status", s);
    if (p) params.set("position", p);
    const qs = params.toString();
    return `/admin/applications${qs ? `?${qs}` : ""}`;
  };
  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold no-underline",
      active ? "border-blue bg-blue text-white hover:text-white" : "border-line bg-white text-navy",
    );

  return (
    <>
      <AdminHeader title="Ирсэн анкет">
        <p className="text-sm text-muted">Хүний нөөц хуудасны онлайн анкетаар ирсэн өргөдлүүд. Шинэ нь эхэндээ.</p>
      </AdminHeader>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Link href={href({ status: undefined })} className={chip(!status)}>
            Бүгд ({all?.length ?? 0})
          </Link>
          {APPLICATION_STATUSES.map((s) => (
            <Link key={s.value} href={href({ status: s.value })} className={chip(status === s.value)}>
              {s.label} ({counts.get(s.value) ?? 0})
            </Link>
          ))}
        </div>
        {positions.size > 1 && (
          <div className="flex flex-wrap gap-2">
            <Link href={href({ position: undefined })} className={chip(!position)}>
              Бүх албан тушаал
            </Link>
            {[...positions].sort().map((p) => (
              <Link key={p} href={href({ position: p })} className={chip(position === p)}>
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>

      <AdminList empty="Анкет алга.">
        {rows.map((row) => {
          const s = statusInfo(row.status);
          return (
            <AdminRow
              key={row.id}
              title={<Link href={`/admin/applications/${row.id}`}>{row.full_name}</Link>}
              meta={
                <>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", s.className)}>{s.label}</span>
                  {row.position} · {dateFormat.format(new Date(row.created_at))} · {row.phone} · {row.email}
                </>
              }
            >
              <Link href={`/admin/applications/${row.id}`} className="text-sm font-semibold text-blue-dark">
                Үзэх
              </Link>
            </AdminRow>
          );
        })}
      </AdminList>
    </>
  );
}
