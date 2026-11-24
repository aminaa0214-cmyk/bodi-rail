import { cn } from "@/lib/cn";

/** Гарчгийн доорх цагаан зураас */
export function Rule({ className }: { className?: string }) {
  return <div className={cn("h-1 w-[140px] bg-white", className)} />;
}
