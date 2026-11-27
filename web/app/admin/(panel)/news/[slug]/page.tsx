import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/list";
import { NewsForm, type NewsRow } from "@/components/admin/NewsForm";
import { requireAdmin } from "@/lib/admin";

type Props = { params: Promise<{ slug: string }> };

export default async function EditNewsPage({ params }: Props) {
  const { slug } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("news").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <AdminHeader title="Мэдээ засах" backHref="/admin/news" />
      <NewsForm news={data as NewsRow} />
    </>
  );
}
