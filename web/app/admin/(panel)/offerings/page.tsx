import Link from "next/link";
import { deleteOffering } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminHeader, AdminList, AdminRow, Badge } from "@/components/admin/list";
import { SECTIONS } from "@/components/admin/OfferingForm";
import { requireAdmin } from "@/lib/admin";

const pageOf = { rental: "/uilchilgee#rent", sale: "/hudaldaa", home: "/" } as Record<string, string>;

export default async function AdminOfferingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("offerings")
    .select("id, section, title, tag, details, sort_order, is_active")
    .order("sort_order")
    .order("id");
  const rows = (data ?? []) as {
    id: number;
    section: string;
    title: string;
    tag: string | null;
    details: string[];
    sort_order: number;
    is_active: boolean;
  }[];

  return (
    <>
      <AdminHeader title="Хөдлөх бүрэлдэхүүн, карт" newHref="/admin/offerings/new" newLabel="Нэмэх">
        <p className="text-sm text-muted">Түрээслүүлэх, худалдах хөдлөх бүрэлдэхүүн болон нүүр хуудасны үйлчилгээний картууд.</p>
      </AdminHeader>

      {SECTIONS.map((section) => {
        const items = rows.filter((r) => r.section === section.value);
        return (
          <section key={section.value} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-navy">{section.label}</h2>
              <div className="flex gap-4 text-sm font-semibold">
                <Link href={pageOf[section.value]} target="_blank" className="text-blue-dark">
                  Сайтад харах ↗
                </Link>
                <Link href={`/admin/offerings/new?section=${section.value}`} className="text-blue-dark">
                  + Энэ хэсэгт нэмэх
                </Link>
              </div>
            </div>
            <AdminList empty="Карт алга.">
              {items.map((row) => (
                <AdminRow
                  key={row.id}
                  title={<Link href={`/admin/offerings/${row.id}`}>{row.title}</Link>}
                  meta={
                    <>
                      {[row.tag, `${row.details.length} үзүүлэлт`, `дараалал ${row.sort_order}`].filter(Boolean).join(" · ")}
                      {!row.is_active && <Badge>Нуусан</Badge>}
                    </>
                  }
                >
                  <Link href={`/admin/offerings/${row.id}`} className="text-sm font-semibold text-blue-dark">
                    Засах
                  </Link>
                  <DeleteButton action={deleteOffering.bind(null, row.id)} confirmText={`“${row.title}” картыг устгах уу?`} />
                </AdminRow>
              ))}
            </AdminList>
          </section>
        );
      })}
    </>
  );
}
