import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/list";
import { OfferingForm, type OfferingRow } from "@/components/admin/OfferingForm";
import { requireAdmin } from "@/lib/admin";

type Props = { params: Promise<{ id: string }> };

export default async function EditOfferingPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("offerings").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <AdminHeader title="Карт засах" backHref="/admin/offerings" />
      <OfferingForm offering={data as OfferingRow} />
    </>
  );
}
