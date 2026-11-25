import Link from "next/link";
import { LogoLockup } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Брэндбүүкийн лого (тэмдэг + бичиглэл). Footer дээр цагаан хувилбар. */
export function Brand({ light }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.brand} — нүүр хуудас`}
      className={cn("flex items-center no-underline", light ? "text-white hover:text-white" : "text-brand hover:text-brand")}
    >
      {/* Тэмдгийн өндөр 40px (≥ 1 см) */}
      <LogoLockup className="h-10 w-auto" title={site.brand} />
    </Link>
  );
}
