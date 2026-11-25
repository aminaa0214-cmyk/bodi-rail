import { cn } from "@/lib/cn";
import { LOGO } from "./logo-geometry";

/*
 * Брэндбүүкийн логог inline SVG-ээр зурна. Өнгө нь currentColor тул `text-brand`, `text-white`
 * гэх мэт классаар солино. Хэмжээг өндрөөр нь өгнө (жишээ: className="h-10 w-auto").
 */

type LogoProps = { className?: string; title?: string };

/** Таван нүдэн тэмдэг */
export function LogoSymbol({ className, title }: LogoProps) {
  return (
    <svg
      viewBox={`0 0 ${LOGO.symbolWidth} ${LOGO.symbolHeight}`}
      className={cn("block flex-none", className)}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={LOGO.symbolD} />
    </svg>
  );
}

/** Тэмдэг + «BODI RAIL» бичиглэл */
export function LogoLockup({ className, title = "BODI RAIL" }: LogoProps) {
  return (
    <svg
      viewBox={`0 0 ${LOGO.wordEnd} ${LOGO.symbolHeight}`}
      className={cn("block flex-none", className)}
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      <path d={LOGO.symbolD} />
      <path d={LOGO.wordD} />
    </svg>
  );
}
