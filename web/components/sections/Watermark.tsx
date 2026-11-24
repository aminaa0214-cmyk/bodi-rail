import { cn } from "@/lib/cn";

const WATERMARK_TEXT = "Зөвхөн танилцуулах зорилгоор · bodirail.mn";
const line = `${WATERMARK_TEXT}      `.repeat(4);

/** Зургийн дээгүүр ташуу давтагдсан усан тэмдэг. Эх элемент нь `relative overflow-hidden` байх ёстой. */
export function Watermark({ small }: { small?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[60%] z-[1] flex -rotate-30 flex-col justify-around select-none"
    >
      {Array.from({ length: 16 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "text-center font-extrabold whitespace-nowrap uppercase tracking-[.08em] text-navy/17",
            small ? "text-[8px]" : "text-[22px]",
          )}
        >
          {line}
        </span>
      ))}
    </div>
  );
}
