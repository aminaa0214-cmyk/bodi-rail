import Link from "next/link";
import { cn } from "@/lib/cn";

/** Хар дэвсгэр дээрх дугуй холбоос (үйлчилгээ хуудасны толгойд) */
export function Chip({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border border-white/35 px-[18px] text-sm font-semibold text-white no-underline hover:bg-white/8 hover:text-white",
        primary && "border-blue bg-blue font-bold hover:bg-blue-dark",
      )}
    >
      {children}
    </Link>
  );
}
