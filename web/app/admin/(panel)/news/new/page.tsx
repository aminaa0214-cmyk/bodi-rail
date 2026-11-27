import { AdminHeader } from "@/components/admin/list";
import { NewsForm } from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <>
      <AdminHeader title="Мэдээ нэмэх" backHref="/admin/news" />
      <NewsForm />
    </>
  );
}
