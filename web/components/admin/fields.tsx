import { control } from "@/components/forms/Field";
import { cn } from "@/lib/cn";

/** Админы маягтын талбарууд (анхны утгатай) */

type Common = { label: string; name: string; hint?: string; full?: boolean; required?: boolean };

function Label({ label, hint, full, required, children }: Omit<Common, "name"> & { children: React.ReactNode }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2 text-sm font-semibold", full && "col-span-full")}>
      <span>
        {label}
        {required && <span className="text-[#c62828]"> *</span>}
      </span>
      {children}
      {hint && <small className="font-normal text-muted">{hint}</small>}
    </label>
  );
}

export function Input({
  label,
  name,
  hint,
  full,
  required,
  defaultValue,
  type = "text",
  ...rest
}: Common & { defaultValue?: string | number | null; type?: string } & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "defaultValue" | "name" | "type"
  >) {
  return (
    <Label label={label} hint={hint} full={full} required={required}>
      <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className={control} {...rest} />
    </Label>
  );
}

export function Textarea({
  label,
  name,
  hint,
  full = true,
  required,
  defaultValue,
  rows = 4,
}: Common & { defaultValue?: string | null; rows?: number }) {
  return (
    <Label label={label} hint={hint} full={full} required={required}>
      <textarea
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={cn(control, "resize-y py-3 leading-[1.6]")}
      />
    </Label>
  );
}

export function Select({
  label,
  name,
  hint,
  full,
  required,
  defaultValue,
  options,
}: Common & { defaultValue?: string; options: { value: string; label: string }[] }) {
  return (
    <Label label={label} hint={hint} full={full} required={required}>
      <select name={name} required={required} defaultValue={defaultValue} className={control}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Label>
  );
}

export function Checkbox({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px] font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-[18px] accent-blue" />
      {label}
      {hint && <small className="font-normal text-muted">({hint})</small>}
    </label>
  );
}

export function FileInput({ label, name, hint, multiple, required }: Common & { multiple?: boolean }) {
  return (
    <Label label={label} hint={hint} required={required}>
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        required={required}
        className={cn(control, "py-2.5 file:mr-3 file:rounded-md file:border-0 file:bg-soft file:px-3 file:py-1.5 file:font-semibold")}
      />
    </Label>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-5 gap-y-4">{children}</div>;
}

export function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-card border border-ph bg-white p-5 md:p-7">
      {title && <h2 className="text-lg font-extrabold text-navy">{title}</h2>}
      {children}
    </section>
  );
}
