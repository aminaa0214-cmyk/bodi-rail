import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Лого + "BODI RAIL". Footer дээр цагаан хувилбар. */
export function Brand({ light }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 text-lg font-extrabold tracking-[.04em] no-underline",
        light ? "text-white hover:text-white" : "text-brand hover:text-brand",
      )}
    >
      <Image src={light ? "/images/logo-white.svg" : "/images/logo.svg"} alt="" width={40} height={40} />
      <span>{site.brand}</span>
    </Link>
  );
}
