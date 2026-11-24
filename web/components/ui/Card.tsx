import { cn } from "@/lib/cn";

const variants = {
  plain: "",
  bordered: "border border-ph",
  dashed: "border-2 border-dashed border-[#9fb3c8] bg-soft",
} as const;

type CardProps = {
  variant?: keyof typeof variants;
  /** Жижиг карт (түрээсийн 4 багана) */
  compact?: boolean;
  /** Картын дээд хэсгийн зураг */
  media?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Card({ variant = "plain", compact, media, className, children }: CardProps) {
  return (
    <article className={cn("flex flex-col overflow-hidden rounded-card bg-white", variants[variant], className)}>
      {media}
      <div className={cn("flex flex-1 flex-col", compact ? "gap-2.5 p-[22px]" : "gap-3 p-7")}>{children}</div>
    </article>
  );
}

export function CardTitle({ compact, className, children }: { compact?: boolean; className?: string; children: React.ReactNode }) {
  return <h3 className={cn("font-bold", compact ? "text-[19px]" : "text-2xl", className)}>{children}</h3>;
}

export function CardText({ children }: { children: React.ReactNode }) {
  return <div className="text-[15px] leading-[1.6] text-muted">{children}</div>;
}
