import { cn } from "@/lib/cn";

const tones = {
  default: "",
  soft: "bg-soft",
  dark: "bg-navy text-white",
} as const;

const DEFAULT_PADDING = "py-[72px] md:py-28";

type SectionProps = {
  id?: string;
  tone?: keyof typeof tones;
  /**
   * Дээд, доод зай. Өгвөл анхдагч зайг ("py-[72px] md:py-28") бүтнээр нь орлоно.
   * Жишээ: padding="pb-[72px] md:pb-28" (дээд зайгүй), padding="py-24"
   */
  padding?: string;
  className?: string;
  as?: "section" | "article";
  children: React.ReactNode;
};

export function Section({ id, tone = "default", padding = DEFAULT_PADDING, className, as: Tag = "section", children }: SectionProps) {
  return (
    <Tag id={id} className={cn(padding, tones[tone], className)}>
      {children}
    </Tag>
  );
}
