"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendApplication } from "@/app/actions/send-application";
import type { Job } from "@/lib/data";
import { HONEYPOT_FIELD } from "@/lib/inquiry";
import {
  ACCEPT_ATTR,
  CONSENT_FIELDS,
  MAX_TOTAL_BYTES,
  MAX_TOTAL_LABEL,
  applicationFiles,
  applicationParts,
  groupFieldName,
  type ApplicationResult,
  type FieldDef,
  type GroupDef,
  type PartItem,
} from "@/lib/application";
import { Button } from "@/components/ui/Button";
import { control } from "@/components/forms/Field";
import { cn } from "@/lib/cn";
import { compressImage } from "@/lib/compress-image";

/** Ажлын байрны картын "Анкет бөглөх" товч энэ event-ийг илгээж, албан тушаалыг сонгуулна. */
export const APPLY_EVENT = "bodi:apply";

const invalid = "aria-[invalid=true]:border-[#c62828] aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-[#c62828]/20";
const grid = "grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-5 gap-y-4";
const tightGrid = "grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-4 gap-y-3";
const subTitle = "mt-7 mb-3 text-[15px] font-bold text-navy";

function Req() {
  return <span className="text-[#c62828]"> *</span>;
}

function Hint({ children }: { children?: React.ReactNode }) {
  return children ? <small className="font-normal text-muted"> ({children})</small> : null;
}

type ControlProps = { field: FieldDef; name: string; required?: boolean; value?: string; onChange?: (v: string) => void };

function Control({ field, name, required = field.required, value, onChange }: ControlProps) {
  const common = {
    name,
    required,
    "aria-required": required || undefined,
    className: cn(control, invalid, "w-full"),
  };
  const controlled = value !== undefined ? { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) } : {};

  if (field.type === "select") {
    return (
      <select {...common} {...controlled} defaultValue={value === undefined ? "" : undefined}>
        <option value="">{required ? "Сонгоно уу" : "—"}</option>
        {field.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }
  if (field.type === "textarea") {
    return <textarea {...common} rows={field.rows ?? 3} className={cn(common.className, "resize-y py-3")} />;
  }
  return (
    <input
      {...common}
      type={field.type ?? "text"}
      placeholder={field.placeholder}
      pattern={field.pattern}
      autoComplete={field.autoComplete}
      min={field.type === "number" ? 0 : undefined}
      inputMode={field.name === "gpa" ? "decimal" : undefined}
    />
  );
}

function FieldBox({ field, children, required }: { field: FieldDef; children: React.ReactNode; required?: boolean }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2 text-sm font-semibold", field.full && "col-span-full")}>
      <span>
        {field.label}
        <Hint>{field.hint}</Hint>
        {required && <Req />}
      </span>
      {children}
    </label>
  );
}

/** "+ нэмэх" товчтой давтагддаг мөрүүд */
function RepeatGroup({ group, resetKey }: { group: GroupDef; resetKey: number }) {
  const min = group.min ?? 0;
  const max = group.max ?? 20;
  const nextId = useRef(min);
  const [rows, setRows] = useState<number[]>(() => Array.from({ length: min }, (_, i) => i));

  useEffect(() => {
    nextId.current = min;
    setRows(Array.from({ length: min }, (_, i) => i));
  }, [resetKey, min]);

  return (
    <div>
      <h4 className={subTitle}>
        {group.title}
        <Hint>{group.hint}</Hint>
      </h4>
      {rows.map((id, index) => (
        <div key={id} className="mb-3 rounded-xl border border-ph bg-soft p-4">
          <div className={tightGrid}>
            {group.fields.map((field) => (
              <FieldBox key={field.name} field={field}>
                <Control field={field} name={groupFieldName(group.key, index, field.name)} />
              </FieldBox>
            ))}
          </div>
          {rows.length > min && (
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((x) => x !== id))}
              className="mt-3 min-h-9 rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-[#c62828]"
            >
              Устгах
            </button>
          )}
        </div>
      ))}
      {rows.length < max && (
        <button
          type="button"
          onClick={() => setRows((r) => [...r, nextId.current++])}
          className="min-h-11 rounded-[10px] border border-dashed border-blue-dark px-4 text-sm font-semibold text-blue-dark hover:bg-sky"
        >
          + {group.addLabel ?? "Нэмэх"}
        </button>
      )}
    </div>
  );
}

function fieldLabel(el: Element) {
  const label = el.closest("label") ?? el.closest("fieldset");
  const text = label?.querySelector("span, legend")?.textContent ?? "Талбар";
  return text.replace("*", "").replace(/\(.*\)/, "").trim();
}

type JobOption = Pick<Job, "title" | "requiresDriverLicense" | "requiresRailDocuments">;

export function ApplicationForm({ jobs }: { jobs: JobOption[] }) {
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [today, setToday] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [result, setResult] = useState<ApplicationResult>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  const selectedJob = jobs.find((job) => job.title === position);
  const isDriver = selectedJob?.requiresDriverLicense ?? false;
  const isRail = selectedJob?.requiresRailDocuments ?? false;

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    const onApply = (e: Event) => setPosition((e as CustomEvent<string>).detail);
    window.addEventListener(APPLY_EVENT, onApply);
    return () => window.removeEventListener(APPLY_EVENT, onApply);
  }, []);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  function fail(message: string, el?: Element | null) {
    setResult({ status: "error", message });
    if (el instanceof HTMLElement) {
      el.setAttribute("aria-invalid", "true");
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

    const firstInvalid = form.querySelector<HTMLElement>(":invalid:not(fieldset)");
    if (firstInvalid) {
      const el = firstInvalid as HTMLInputElement;
      if (el.name === "register_no" && el.value) return fail("Регистрийн дугаар 2 үсэг, 8 тооноос бүрдэнэ (жишээ нь АА00000000).", el);
      if (el.type === "checkbox") return fail("Баталгаажуулалтын хэсгийг зөвшөөрнө үү.", el);
      if (el.type === "file") return fail(`“${fieldLabel(el)}” файлыг хавсаргана уу.`, el);
      return fail(`“${fieldLabel(el)}” талбарыг зөв бөглөнө үү.`, el);
    }
    if (isDriver && !form.querySelector('input[name="license_class"]:checked')) {
      return fail(`“${position}” ажлын байранд жолооны үнэмлэхний ангиллаа сонгоно уу.`, form.querySelector('input[name="license_class"]'));
    }

    setResult({ status: "idle" });
    startTransition(async () => {
      const raw = new FormData(form);
      const data = new FormData();
      let total = 0;
      for (const [key, value] of raw.entries()) {
        if (value instanceof File) {
          if (value.size === 0) continue;
          const file = await compressImage(value);
          total += file.size;
          data.append(key, file);
        } else {
          data.append(key, value);
        }
      }
      if (total > MAX_TOTAL_BYTES) {
        setResult({
          status: "error",
          message: `Хавсралтын нийт хэмжээ ${MAX_TOTAL_LABEL}-аас их байна. PDF файлаа жижигрүүлэх эсвэл зураг хэлбэрээр хавсаргана уу.`,
        });
        return;
      }
      try {
        const res = await sendApplication(data);
        setResult(res);
        if (res.status === "success") {
          form.reset();
          setPosition("");
          setPhotoUrl(null);
          setResetKey((k) => k + 1);
        }
      } catch {
        setResult({ status: "error", message: "Илгээхэд алдаа гарлаа. Файлын хэмжээ их байж магадгүй. Дахин оролдоно уу." });
      }
    });
  }

  function renderItem(item: PartItem, key: number) {
    if (item.kind === "group") return <RepeatGroup key={key} group={item.group} resetKey={resetKey} />;

    if (item.kind === "choice") {
      const required = item.choice.name === "license_class" && isDriver;
      return (
        <fieldset key={key} className="min-w-0">
          {item.title && (
            <legend className={subTitle}>
              {item.title}
              {required && <Req />}
            </legend>
          )}
          <div className="text-sm font-semibold">{item.choice.label}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-[15px]">
            {item.choice.options.map((option) => (
              <label key={option} className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                <input type={item.choice.kind} name={item.choice.name} value={option} className="size-[18px] accent-blue" />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    return (
      <div key={key}>
        {item.title && (
          <h4 className={subTitle}>
            {item.title}
            <Hint>{item.hint}</Hint>
          </h4>
        )}
        <div className={cn(grid, !item.title && key > 0 && "mt-5")}>
          {item.fields.map((field) => {
            const required = field.required || (field.name === "driving_years" && isDriver);
            return (
              <FieldBox key={field.name} field={field} required={required}>
                {field.name === "position_1" ? (
                  <Control
                    field={{ ...field, options: jobs.map((job) => job.title) }}
                    name={field.name}
                    value={position}
                    onChange={setPosition}
                  />
                ) : (
                  <Control field={field} name={field.name} required={required} />
                )}
              </FieldBox>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onInput={(e) => (e.target as HTMLElement).removeAttribute?.("aria-invalid")}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Спам ботын урхи: хүнд харагдахгүй */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Вэбсайт
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {applicationParts.map((part) => (
        <fieldset key={part.legend} className="min-w-0 rounded-card bg-white p-5 md:p-8">
          <legend className="float-left mb-1 w-full border-b border-ph pb-5 text-xl font-extrabold text-navy">{part.legend}</legend>
          <div className="clear-both">{part.items.map(renderItem)}</div>
        </fieldset>
      ))}

      {/* Хавсралт */}
      <fieldset className="min-w-0 rounded-card bg-white p-5 md:p-8">
        <legend className="float-left mb-1 w-full border-b border-ph pb-5 text-xl font-extrabold text-navy">8. Хавсралт</legend>
        <div className="clear-both">
          <p className="mt-4 mb-4 text-sm text-muted">
            Зураг (JPG, PNG) эсвэл PDF файл хавсаргана. Нийт хэмжээ {MAX_TOTAL_LABEL}-аас ихгүй байна. Зургийг илгээхдээ
            автоматаар жижигрүүлнэ.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5">
            {applicationFiles.map((file) => {
              const required = file.required === "always" || (file.required === "rail" && isRail);
              const input = (
                <input
                  type="file"
                  name={file.name}
                  accept={file.imageOnly ? "image/jpeg,image/png" : ACCEPT_ATTR}
                  multiple={file.multiple}
                  required={required}
                  className={cn(control, invalid, "w-full border-dashed bg-soft p-2.5")}
                  onChange={
                    file.name === "photo"
                      ? (e) => {
                          const f = e.target.files?.[0];
                          setPhotoUrl(f ? URL.createObjectURL(f) : null);
                        }
                      : undefined
                  }
                />
              );
              const label = (
                <span>
                  {file.label}
                  <Hint>{file.hint}</Hint>
                  {required && <Req />}
                </span>
              );
              if (file.name !== "photo") {
                return (
                  <label key={file.name} className="flex min-w-0 flex-col gap-2 text-sm font-semibold">
                    {label}
                    {input}
                  </label>
                );
              }
              return (
                <div key={file.name} className="flex items-end gap-4">
                  <div
                    aria-hidden="true"
                    className="flex h-[120px] w-[90px] flex-none items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-soft text-center text-xs text-muted"
                  >
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- хэрэглэгчийн сонгосон файлын урьдчилсан харагдац
                      <img src={photoUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <span>
                        Цээж зураг
                        <br />
                        3×4
                      </span>
                    )}
                  </div>
                  <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm font-semibold">
                    {label}
                    {input}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </fieldset>

      {/* Баталгаажуулалт */}
      <fieldset className="min-w-0 rounded-card bg-white p-5 md:p-8">
        <legend className="float-left mb-1 w-full border-b border-ph pb-5 text-xl font-extrabold text-navy">Баталгаажуулалт</legend>
        <div className="clear-both flex flex-col gap-4 pt-4">
          {Object.entries(CONSENT_FIELDS).map(([name, text]) => (
            <label key={name} className="flex cursor-pointer items-start gap-3 text-[15px] leading-[1.6]">
              <input type="checkbox" name={name} required className={cn("mt-1 size-5 flex-none accent-blue", invalid)} />
              <span>
                {text}
                <Req />
              </span>
            </label>
          ))}
          <div className={grid}>
            <FieldBox field={{ name: "signature", label: "Өргөдөл гаргагчийн овог нэр (гарын үсгийн оронд)" }} required>
              <input name="signature" required className={cn(control, invalid, "w-full")} />
            </FieldBox>
            <FieldBox field={{ name: "submitted_date", label: "Өргөдөл гаргасан огноо" }}>
              <input name="submitted_date" type="date" value={today} readOnly className={cn(control, "w-full bg-soft")} />
            </FieldBox>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "min-w-0 flex-[1_1_320px] text-[15px] font-semibold",
            result.status === "success" && "text-[#1b7a3e]",
            result.status === "error" && "text-[#c62828]",
          )}
        >
          {result.status !== "idle" && result.message}
        </p>
        <Button type="submit" caps disabled={pending}>
          {pending ? "Илгээж байна…" : "Анкет илгээх"}
        </Button>
      </div>
    </form>
  );
}
