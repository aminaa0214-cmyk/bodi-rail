import { cn } from "@/lib/cn";
import { Pill } from "./Pill";

type SectionHeadProps = {
  pill?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Хар дэвсгэртэй хэсэгт */
  onDark?: boolean;
  /** Баруун талд байрлах холбоос, товч ("Бүгдийг үзэх" г.м.) */
  action?: React.ReactNode;
  className?: string;
};

export function SectionHead({ pill, title, description, align = "left", onDark, action, className }: SectionHeadProps) {
  const center = align === "center";
  const head = (
    <div className={cn("flex flex-col gap-4", center && "items-center text-center", !action && "mb-12", !action && className)}>
      {pill && (
        <Pill outline={onDark} className={center ? "self-center" : undefined}>
          {pill}
        </Pill>
      )}
      <h2 className="text-[30px] font-extrabold md:text-[40px]">{title}</h2>
      {description && (
        <p className={cn("max-w-[640px] text-[17px]", onDark ? "text-light" : "text-muted")}>{description}</p>
      )}
    </div>
  );

  if (!action) return head;

  return (
    <div className={cn("mb-12 flex flex-wrap items-end justify-between gap-4", className)}>
      {head}
      {action}
    </div>
  );
}
