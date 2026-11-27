import { AdminHeader } from "@/components/admin/list";
import { OfferingForm } from "@/components/admin/OfferingForm";

type Props = { searchParams: Promise<{ section?: string }> };

export default async function NewOfferingPage({ searchParams }: Props) {
  const { section } = await searchParams;
  return (
    <>
      <AdminHeader title="Карт нэмэх" backHref="/admin/offerings" />
      <OfferingForm section={section} />
    </>
  );
}
