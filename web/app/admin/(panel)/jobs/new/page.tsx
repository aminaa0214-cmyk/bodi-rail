import { JobForm } from "@/components/admin/JobForm";
import { AdminHeader } from "@/components/admin/list";

export default function NewJobPage() {
  return (
    <>
      <AdminHeader title="Ажлын зар нэмэх" backHref="/admin/jobs" />
      <JobForm />
    </>
  );
}
