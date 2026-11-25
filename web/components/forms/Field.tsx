import { cn } from "@/lib/cn";

export const control =
  "min-h-12 rounded-[10px] border border-line bg-white px-3.5 text-[15px] font-normal text-navy focus:outline-2 focus:outline-offset-1 focus:outline-blue";

type BaseProps = {
  label: string;
  name: string;
  /** Маягтын бүтэн мөрийг эзлэх */
  full?: boolean;
  className?: string;
};

function FieldLabel({ label, full, className, children }: Omit<BaseProps, "name"> & { children: React.ReactNode }) {
  return (
    <label className={cn("flex flex-col gap-2 text-sm font-semibold", full && "col-span-full", className)}>
      {label}
      {children}
    </label>
  );
}

type TextFieldProps = BaseProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "className">;

export function TextField({ label, name, full, className, type = "text", ...input }: TextFieldProps) {
  return (
    <FieldLabel label={label} full={full} className={className}>
      <input name={name} type={type} className={control} {...input} />
    </FieldLabel>
  );
}

type SelectFieldProps = BaseProps & { options: string[] };

export function SelectField({ label, name, full, className, options }: SelectFieldProps) {
  return (
    <FieldLabel label={label} full={full} className={className}>
      <select name={name} className={control}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </FieldLabel>
  );
}

export function TextareaField({ label, name, full, className, rows = 4 }: BaseProps & { rows?: number }) {
  return (
    <FieldLabel label={label} full={full} className={className}>
      <textarea name={name} rows={rows} className={cn(control, "resize-y py-3")} />
    </FieldLabel>
  );
}

/** Ард нь нэгжтэй тоон талбар (жишээ нь "тонн") */
export function UnitField({
  label,
  name,
  unit,
  full,
  className,
  ...input
}: TextFieldProps & { unit: string }) {
  return (
    <FieldLabel label={label} full={full} className={className}>
      <span className="flex overflow-hidden rounded-[10px] border border-line focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue">
        <input
          name={name}
          type="number"
          className="min-h-12 min-w-0 flex-1 bg-white px-3.5 text-[15px] font-normal text-navy outline-none"
          {...input}
        />
        <span className="flex items-center bg-soft px-3.5 font-semibold text-muted">{unit}</span>
      </span>
    </FieldLabel>
  );
}

/** Талбаруудыг багтах хэмжээгээр 1–3 баганад байрлуулна */
export function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-5 gap-y-4">{children}</div>
  );
}

export function FormFieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="pb-4 text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark">{legend}</legend>
      {children}
    </fieldset>
  );
}
