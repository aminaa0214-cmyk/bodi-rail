import { cn } from "@/lib/cn";

type PillProps = {
  /** Хар дэвсгэр дээр хүрээтэй хувилбар */
  outline?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Pill({ outline, className, children }: PillProps) {
  return (
    <span
      className={cn(
        "self-start rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.1em]",
        outline ? "border border-white/35 text-light" : "bg-sky text-blue-dark",
        className,
      )}
    >
      {children}
    </span>
  );
}
