import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Section } from "@/components/ui/Section";
import { Stats } from "@/components/ui/Stats";
import { Gallery } from "@/components/sections/Gallery";
import { getNewsBySlug, news } from "@/content/news";

type Props = { params: Promise<{ slug: string }> };

// Зөвхөн content/news.ts-д байгаа мэдээнүүд; бусад нь 404
export const dynamicParams = false;

export function generateStaticParams() {
  return news.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getNewsBySlug((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: { type: "article", images: [article.cover.src] },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = getNewsBySlug((await params).slug);
  if (!article) notFound();

  return (
    <>
      <PageHero
        title={article.title}
        normalCase
        breadcrumb={[{ label: "Мэдээ", href: "/#news" }]}
        description={<time dateTime={article.date.replaceAll(".", "-")}>{article.date}</time>}
      />

      <Section as="article" padding="pt-[72px] pb-24">
        <Container className="flex max-w-[860px] flex-col gap-5 [&>p]:text-[17px] [&>p]:leading-[1.8] [&>p]:text-[#22324a]">
          <Image
            src={article.cover.src}
            alt={article.cover.alt}
            width={article.cover.width}
            height={article.cover.height}
            sizes="(max-width: 908px) 100vw, 860px"
            loading="eager"
            fetchPriority="high"
            className="mb-3 h-auto w-full rounded-card"
          />

          {article.lead && (
            <p>
              <strong>{article.lead}</strong>
            </p>
          )}
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {article.stats && <Stats items={article.stats} className="my-2" />}
          {article.gallery && <Gallery images={article.gallery} />}

          <LinkArrow href="/#news">Бүх мэдээ рүү буцах</LinkArrow>
        </Container>
      </Section>
    </>
  );
}
