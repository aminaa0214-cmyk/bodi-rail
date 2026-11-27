import { notFound } from "next/navigation";
import { JobForm, type JobRow } from "@/components/admin/JobForm";
import { AdminHeader } from "@/components/admin/list";
import { requireAdmin } from "@/lib/admin";

type Props = { params: Promise<{ id: string }> };

export default async function EditJobPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <AdminHeader title="Ажлын зар засах" backHref="/admin/jobs" />
      <JobForm job={data as JobRow} />
    </>
  );
}
