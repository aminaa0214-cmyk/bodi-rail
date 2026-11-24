import { cn } from "@/lib/cn";

export type StatItem = {
  value: string;
  label: string;
  /** Урт утгатай (жишээ нь "ТТ → ГС") үед жижиг үсгээр */
  small?: boolean;
};

export function Stats({ items, size = "lg", className }: { items: StatItem[]; size?: "lg" | "md"; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-soft p-5">
          <div
            className={cn(
              "font-extrabold text-blue",
              item.small ? "text-[22px]" : size === "md" ? "text-[28px]" : "text-[34px]",
            )}
          >
            {item.value}
          </div>
          <div className="pt-1 text-sm text-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
