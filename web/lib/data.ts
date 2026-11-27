/**
 * Сайтын агуулгыг Supabase-аас уншина. Агуулгыг Supabase dashboard → Table Editor дээр засна:
 * - jobs: нээлттэй ажлын байр (анкетын "Албан тушаал" сонголт мөн эндээс)
 * - offerings: картууд (section: home = нүүр хуудас, sale = Худалдаа, rental = Түрээс)
 * - news: мэдээ (/medee/<slug>)
 * Өөрчлөлт сайтад CONTENT_REVALIDATE_SECONDS (60 секунд) дотор гарна.
 */
import { cache } from "react";
import { selectRows } from "@/lib/supabase";

// ---------- Ажлын зар ----------

export type Job = {
  tag: string;
  title: string;
  hours: string;
  summary: string;
  duties: string[];
  requirements: string[];
  /** Анкетад жолооны үнэмлэхний ангилал заавал */
  requiresDriverLicense: boolean;
  /** Анкетад иргэний үнэмлэх, ажил байдлын тодорхойлолт заавал */
  requiresRailDocuments: boolean;
};

type JobRow = {
  tag: string;
  title: string;
  hours: string;
  summary: string;
  duties: string[];
  requirements: string[];
  requires_driver_license: boolean;
  requires_rail_documents: boolean;
};

export const getJobs = cache(async (): Promise<Job[]> => {
  const rows = await selectRows<JobRow>(
    "jobs",
    "select=tag,title,hours,summary,duties,requirements,requires_driver_license,requires_rail_documents&order=sort_order.asc,id.asc",
  );
  return rows.map((r) => ({
    tag: r.tag,
    title: r.title,
    hours: r.hours,
    summary: r.summary,
    duties: r.duties,
    requirements: r.requirements,
    requiresDriverLicense: r.requires_driver_license,
    requiresRailDocuments: r.requires_rail_documents,
  }));
});

// ---------- Бүтээгдэхүүн, үйлчилгээний картууд ----------

export type OfferingSection = "home" | "sale" | "rental";

export type Offering = {
  id: number;
  tag?: string;
  title: string;
  /** Картын текст. Мөр бүр тусдаа (\n-ээр хуваасан) */
  lines: string[];
  details: string[];
  href?: string;
  image?: { src: string; alt: string; position?: string };
  placeholder: string;
};

type OfferingRow = {
  id: number;
  tag: string | null;
  title: string;
  body: string | null;
  details: string[];
  href: string | null;
  image_src: string | null;
  image_alt: string | null;
  image_position: string | null;
  placeholder: string | null;
};

export const getOfferings = cache(async (section: OfferingSection): Promise<Offering[]> => {
  const rows = await selectRows<OfferingRow>(
    "offerings",
    `select=id,tag,title,body,details,href,image_src,image_alt,image_position,placeholder&section=eq.${section}&order=sort_order.asc,id.asc`,
    ["offerings"],
  );
  return rows.map((r) => ({
    id: r.id,
    tag: r.tag ?? undefined,
    title: r.title,
    lines: (r.body ?? "").split("\n").filter(Boolean),
    details: r.details,
    href: r.href ?? undefined,
    image: r.image_src
      ? { src: r.image_src, alt: r.image_alt ?? "", position: r.image_position ?? undefined }
      : undefined,
    placeholder: r.placeholder ?? r.title,
  }));
});

// ---------- Мэдээ ----------

export type NewsImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Галерейд бүтэн мөрийг эзлэх эсэх */
  wide?: boolean;
};

export type NewsStat = { value: string; label: string; small?: boolean };

export type NewsArticle = {
  slug: string;
  /** YYYY.MM.DD */
  date: string;
  title: string;
  /** Нүүр хуудасны картад харагдах товч агуулга */
  excerpt: string;
  /** Хайлтын системд зориулсан тайлбар */
  description: string;
  cover: NewsImage & { position?: string };
  /** Эхний догол мөрийг тодоор харуулна */
  lead?: string;
  body: string[];
  stats?: NewsStat[];
  gallery?: NewsImage[];
};

type NewsRow = {
  slug: string;
  published_on: string;
  title: string;
  excerpt: string;
  description: string;
  lead: string | null;
  body: string[];
  cover: NewsArticle["cover"];
  stats: NewsStat[] | null;
  gallery: NewsImage[] | null;
};

function toArticle(r: NewsRow): NewsArticle {
  return {
    slug: r.slug,
    date: r.published_on.replaceAll("-", "."),
    title: r.title,
    excerpt: r.excerpt,
    description: r.description,
    cover: r.cover,
    lead: r.lead ?? undefined,
    body: r.body,
    stats: r.stats ?? undefined,
    gallery: r.gallery ?? undefined,
  };
}

/** Нийтлэгдсэн мэдээ, шинэ нь эхэндээ */
export const getNews = cache(async (): Promise<NewsArticle[]> => {
  const rows = await selectRows<NewsRow>("news", "select=*&order=published_on.desc,created_at.desc");
  return rows.map(toArticle);
});

export const getNewsBySlug = cache(async (slug: string): Promise<NewsArticle | undefined> => {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const rows = await selectRows<NewsRow>("news", `select=*&slug=eq.${slug}&limit=1`, ["news"]);
  return rows[0] ? toArticle(rows[0]) : undefined;
});
