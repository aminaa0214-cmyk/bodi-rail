import { notFound } from "next/navigation";
import { deleteApplication, updateApplication } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Panel, Select, Textarea } from "@/components/admin/fields";
import { AdminHeader } from "@/components/admin/list";
import { requireAdmin } from "@/lib/admin";
import { applicationParts, CONSENT_FIELDS } from "@/lib/application";
import { APPLICATION_STATUSES, statusInfo, type ApplicationRow } from "@/lib/application-status";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ id: string }> };

const dateFormat = new Intl.DateTimeFormat("mn-MN", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function Pair({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="font-semibold break-words whitespace-pre-line text-navy">{value}</dd>
    </div>
  );
}

const pairGrid = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-x-6 gap-y-4";

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const app = data as ApplicationRow;
  const answers = app.answers ?? {};
  const status = statusInfo(app.status);

  // Хавсралтыг 1 цагийн хугацаатай холбоосоор татна (bucket хувийн)
  const files = app.files ?? [];
  const { data: signed } = files.length
    ? await supabase.storage.from("applications").createSignedUrls(
        files.map((f) => f.path),
        3600,
      )
    : { data: [] };
  const urlOf = (path: string) => signed?.find((s) => s.path === path)?.signedUrl ?? undefined;
  const photo = files.find((f) => f.field === "photo" && f.type.startsWith("image/"));

  return (
    <>
      <AdminHeader title={app.full_name} backHref="/admin/applications">
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", status.className)}>{status.label}</span>
          {app.position} · {dateFormat.format(new Date(app.created_at))}
        </p>
      </AdminHeader>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          {applicationParts.map((part) => {
            const blocks = part.items.map((item, i) => {
              if (item.kind === "fields") {
                const pairs = item.fields.filter((f) => answers[f.name]);
                if (!pairs.length) return null;
                return (
                  <div key={i} className="flex flex-col gap-3">
                    {item.title && <h3 className="text-[15px] font-bold text-navy">{item.title}</h3>}
                    <dl className={pairGrid}>
                      {pairs.map((f) => (
                        <Pair key={f.name} label={f.label} value={String(answers[f.name])} />
                      ))}
                    </dl>
                  </div>
                );
              }
              if (item.kind === "choice") {
                const values = answers[item.choice.name] as string[] | undefined;
                if (!values?.length) return null;
                return (
                  <dl key={i} className={pairGrid}>
                    <Pair label={item.title ?? item.choice.label} value={values.join(", ")} />
                  </dl>
                );
              }
              const rows = answers[item.group.key] as Record<string, string>[] | undefined;
              if (!rows?.length) return null;
              return (
                <div key={i} className="flex flex-col gap-3">
                  <h3 className="text-[15px] font-bold text-navy">{item.group.title}</h3>
                  {rows.map((row, r) => (
                    <dl key={r} className={cn(pairGrid, "rounded-[12px] bg-soft p-4")}>
                      {item.group.fields
                        .filter((f) => row[f.name])
                        .map((f) => (
                          <Pair key={f.name} label={f.label} value={row[f.name]} />
                        ))}
                    </dl>
                  ))}
                </div>
              );
            });
            if (blocks.every((b) => b === null)) return null;
            return (
              <Panel key={part.legend} title={part.legend}>
                {blocks}
              </Panel>
            );
          })}

          <Panel title="Баталгаажуулалт">
            <dl className={pairGrid}>
              {Object.entries(CONSENT_FIELDS).map(([name, label]) => (
                <Pair key={name} label={label} value={answers[name] ? "Зөвшөөрсөн" : "—"} />
              ))}
              <Pair label="Өргөдөл гаргагч" value={String(answers.signature ?? "—")} />
              <Pair label="Огноо" value={String(answers.submitted_date ?? "—")} />
            </dl>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-6">
          <Panel>
            {photo && urlOf(photo.path) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urlOf(photo.path)} alt={`${app.full_name} цээж зураг`} className="aspect-[3/4] w-40 rounded-[12px] object-cover" />
            )}
            <dl className="flex flex-col gap-3">
              <Pair label="Утас" value={<a href={`tel:${app.phone}`}>{app.phone}</a>} />
              <Pair label="И-мэйл" value={<a href={`mailto:${app.email}`}>{app.email}</a>} />
              <Pair label="Регистрийн дугаар" value={app.register_no} />
            </dl>
          </Panel>

          <Panel title="Хавсралт">
            {files.length === 0 ? (
              <p className="text-sm text-muted">Хавсралт алга.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {files.map((f) => (
                  <li key={f.path} className="flex flex-col">
                    <span className="text-muted">{f.label}</span>
                    {urlOf(f.path) ? (
                      <a href={urlOf(f.path)} target="_blank" rel="noopener" className="font-semibold break-all text-blue-dark">
                        {f.original_name} ↗
                      </a>
                    ) : (
                      <span className="font-semibold">{f.original_name} (олдсонгүй)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted">Холбоос 1 цагийн дараа хүчингүй болно. Хуудсыг дахин ачаалбал шинэчлэгдэнэ.</p>
          </Panel>

          <Panel title="Төлөв, тэмдэглэл">
            <AdminForm action={updateApplication}>
              <input type="hidden" name="id" value={app.id} />
              <Select
                label="Төлөв"
                name="status"
                defaultValue={app.status}
                options={APPLICATION_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
              />
              <Textarea label="Дотоод тэмдэглэл" name="note" rows={4} defaultValue={app.note} hint="Зөвхөн админд харагдана" />
            </AdminForm>
          </Panel>

          <DeleteButton
            action={deleteApplication.bind(null, app.id)}
            label="Анкетыг устгах"
            confirmText={`${app.full_name}-ийн анкетыг хавсралттай нь бүрмөсөн устгах уу?`}
          />
        </div>
      </div>
    </>
  );
}
