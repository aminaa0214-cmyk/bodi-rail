import Link from "next/link";
import { deleteNews } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminHeader, AdminList, AdminRow, Badge } from "@/components/admin/list";
import { requireAdmin } from "@/lib/admin";

export default async function AdminNewsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("news")
    .select("slug, title, published_on, is_published")
    .order("published_on", { ascending: false });
  const rows = (data ?? []) as { slug: string; title: string; published_on: string; is_published: boolean }[];

  return (
    <>
      <AdminHeader title="Мэдээ" newHref="/admin/news/new" newLabel="Мэдээ нэмэх" />
      <AdminList empty="Мэдээ алга.">
        {rows.map((row) => (
          <AdminRow
            key={row.slug}
            title={<Link href={`/admin/news/${row.slug}`}>{row.title}</Link>}
            meta={
              <>
                {row.published_on.replaceAll("-", ".")} · /medee/{row.slug}
                {!row.is_published && <Badge>Нийтлээгүй</Badge>}
              </>
            }
          >
            <Link href={`/medee/${row.slug}`} target="_blank" className="text-sm font-semibold text-blue-dark">
              Сайтад харах ↗
            </Link>
            <Link href={`/admin/news/${row.slug}`} className="text-sm font-semibold text-blue-dark">
              Засах
            </Link>
            <DeleteButton action={deleteNews.bind(null, row.slug)} confirmText={`“${row.title}” мэдээг устгах уу?`} />
          </AdminRow>
        ))}
      </AdminList>
    </>
  );
}
