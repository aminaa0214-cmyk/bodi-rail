import Link from "next/link";
import { deleteJob } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminHeader, AdminList, AdminRow, Badge } from "@/components/admin/list";
import { requireAdmin } from "@/lib/admin";

export default async function AdminJobsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("jobs")
    .select("id, title, tag, hours, sort_order, is_active")
    .order("sort_order")
    .order("id");
  const rows = (data ?? []) as { id: number; title: string; tag: string; hours: string; sort_order: number; is_active: boolean }[];

  return (
    <>
      <AdminHeader title="Ажлын зар" newHref="/admin/jobs/new" newLabel="Ажлын зар нэмэх" />
      <AdminList empty="Ажлын зар алга.">
        {rows.map((row) => (
          <AdminRow
            key={row.id}
            title={<Link href={`/admin/jobs/${row.id}`}>{row.title}</Link>}
            meta={
              <>
                {row.tag} · {row.hours} · дараалал {row.sort_order}
                {!row.is_active && <Badge>Нуусан</Badge>}
              </>
            }
          >
            <Link href={`/admin/jobs/${row.id}`} className="text-sm font-semibold text-blue-dark">
              Засах
            </Link>
            <DeleteButton action={deleteJob.bind(null, row.id)} confirmText={`“${row.title}” ажлын зарыг устгах уу?`} />
          </AdminRow>
        ))}
      </AdminList>
    </>
  );
}
