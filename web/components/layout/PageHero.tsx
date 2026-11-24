import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Rule } from "@/components/ui/Rule";
import { cn } from "@/lib/cn";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  title: string;
  /** "Нүүр"-ийн дараах замууд */
  breadcrumb: Crumb[];
  description?: React.ReactNode;
  /** Мэдээний гарчиг шиг урт гарчгийг том үсгээр бичихгүй */
  normalCase?: boolean;
  /** Гарчгийн доор нэмэлт агуулга (chip-үүд г.м.) */
  children?: React.ReactNode;
};

/** Дотоод хуудасны толгой хэсэг */
export function PageHero({ title, breadcrumb, description, normalCase, children }: PageHeroProps) {
  const crumbs: Crumb[] = [{ label: "Нүүр", href: "/" }, ...breadcrumb];

  return (
    <section className="bg-navy pb-[72px] text-white">
      <Container className="flex flex-col gap-4 pt-[72px]">
        <nav aria-label="Байршил" className="flex flex-wrap gap-2 text-sm text-[#a9bcd4]">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-light no-underline hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className={cn("text-4xl leading-[1.1] font-extrabold md:text-5xl", !normalCase && "uppercase")}>{title}</h1>
        <Rule className="w-[120px]" />
        {description && <p className="max-w-[680px] text-lg leading-[1.6] text-light">{description}</p>}
        {children}
      </Container>
    </section>
  );
}
