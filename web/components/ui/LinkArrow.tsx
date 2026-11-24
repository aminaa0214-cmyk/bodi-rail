import Link from "next/link";
import { cn } from "@/lib/cn";

/** "Дэлгэрэнгүй →" маягийн холбоос */
export function LinkArrow({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex min-h-11 items-center gap-1.5 self-start font-semibold no-underline", className)}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
