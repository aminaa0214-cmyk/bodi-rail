import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/content/news";
import { Card, CardText, CardTitle } from "@/components/ui/Card";
import { LinkArrow } from "@/components/ui/LinkArrow";

export function NewsCard({ article }: { article: NewsArticle }) {
  const href = `/medee/${article.slug}`;
  return (
    <Card
      media={
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <Image
            src={article.cover.src}
            alt=""
            width={article.cover.width}
            height={article.cover.height}
            sizes="(max-width: 900px) 100vw, 420px"
            className="h-[200px] w-full object-cover"
            style={{ objectPosition: article.cover.position ?? "center" }}
          />
        </Link>
      }
    >
      <time className="text-[13px] text-muted" dateTime={article.date.replaceAll(".", "-")}>
        {article.date}
      </time>
      <CardTitle className="text-[19px]">{article.title}</CardTitle>
      <CardText>
        <p>{article.excerpt}</p>
      </CardText>
      <LinkArrow href={href}>Дэлгэрэнгүй</LinkArrow>
    </Card>
  );
}
