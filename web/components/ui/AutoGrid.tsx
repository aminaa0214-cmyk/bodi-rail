import { cn } from "@/lib/cn";

/** Баганын хамгийн бага өргөн. Дэлгэцэд багтах хэмжээгээр багана автоматаар нэмэгдэнэ. */
const columns = {
  220: "grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]",
  260: "grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5",
  320: "grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]",
  380: "grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))]",
} as const;

export function AutoGrid({
  min = 320,
  className,
  children,
}: {
  min?: keyof typeof columns;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("grid gap-6", columns[min], className)}>{children}</div>;
}
