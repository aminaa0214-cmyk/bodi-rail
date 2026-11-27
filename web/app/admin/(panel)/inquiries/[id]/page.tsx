import { notFound } from "next/navigation";
import { deleteInquiry, updateInquiry } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Panel, Select, Textarea } from "@/components/admin/fields";
import { AdminHeader } from "@/components/admin/list";
import { requireAdmin } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { inquiryForms } from "@/lib/inquiry";
import { INQUIRY_STATUSES, inquiryFieldLabel, inquiryKindLabel, inquiryStatus, type InquiryRow } from "@/lib/inquiry-status";

type Props = { params: Promise<{ id: string }> };

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const inquiry = data as InquiryRow;
  const status = inquiryStatus(inquiry.status);

  // Маягтын талбаруудын дарааллаар харуулна
  const order = Object.keys(inquiryForms[inquiry.kind]?.fields ?? {});
  const entries = Object.entries(inquiry.answers ?? {}).sort(
    ([a], [b]) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99),
  );

  return (
    <>
      <AdminHeader title={inquiry.name} backHref="/admin/inquiries">
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", status.className)}>{status.label}</span>
          {inquiryKindLabel(inquiry.kind)} · {dateFormat.format(new Date(inquiry.created_at))}
        </p>
      </AdminHeader>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <Panel title="Хүсэлтийн мэдээлэл">
          <dl className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-x-6 gap-y-4">
            {entries.map(([field, value]) => (
              <div key={field} className={cn("flex min-w-0 flex-col gap-0.5", field === "message" && "col-span-full")}>
                <dt className="text-[13px] text-muted">{inquiryFieldLabel(inquiry.kind, field)}</dt>
                <dd className="font-semibold break-words whitespace-pre-line text-navy">
                  {field === "phone" ? (
                    <a href={`tel:${value}`}>{value}</a>
                  ) : field === "email" ? (
                    <a href={`mailto:${value}`}>{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted">
            {inquiry.emailed
              ? "info@bodirail.mn руу и-мэйлээр илгээгдсэн."
              : "И-мэйлээр илгээгдээгүй (и-мэйлийн тохиргоо хийгдээгүй эсвэл алдаа гарсан). Зөвхөн энд хадгалагдсан."}
          </p>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Төлөв, тэмдэглэл">
            <AdminForm action={updateInquiry}>
              <input type="hidden" name="id" value={inquiry.id} />
              <Select
                label="Төлөв"
                name="status"
                defaultValue={inquiry.status}
                options={INQUIRY_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
              />
              <Textarea label="Дотоод тэмдэглэл" name="note" rows={4} defaultValue={inquiry.note} hint="Зөвхөн админд харагдана" />
            </AdminForm>
          </Panel>
          <DeleteButton
            action={deleteInquiry.bind(null, inquiry.id)}
            label="Хүсэлтийг устгах"
            confirmText={`${inquiry.name}-ийн хүсэлтийг устгах уу?`}
          />
        </div>
      </div>
    </>
  );
}
