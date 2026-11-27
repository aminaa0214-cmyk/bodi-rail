import { saveNews } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Checkbox, FileInput, Grid, Input, Panel, Textarea } from "@/components/admin/fields";
import type { NewsArticle } from "@/lib/data";

export type NewsRow = {
  slug: string;
  published_on: string;
  title: string;
  excerpt: string;
  description: string;
  lead: string | null;
  body: string[];
  cover: NewsArticle["cover"];
  stats: NonNullable<NewsArticle["stats"]> | null;
  gallery: NonNullable<NewsArticle["gallery"]> | null;
  is_published: boolean;
};

export function NewsForm({ news }: { news?: NewsRow }) {
  const gallery = news?.gallery ?? [];
  return (
    <AdminForm action={saveNews} submitLabel={news ? "Хадгалах" : "Мэдээ нэмэх"}>
      <input type="hidden" name="original_slug" value={news?.slug ?? ""} />
      <input type="hidden" name="cover_current" value={news ? JSON.stringify(news.cover) : ""} />
      <input type="hidden" name="gallery_current" value={JSON.stringify(gallery)} />

      <Panel title="Үндсэн мэдээлэл">
        <Grid>
          <Input label="Гарчиг" name="title" required full defaultValue={news?.title} />
          <Input
            label="Slug (хаяг)"
            name="slug"
            required
            defaultValue={news?.slug}
            pattern="[a-z0-9\-]+"
            hint="Латин жижиг үсэг, тоо, зураас. Мэдээний хаяг: /medee/<slug>"
          />
          <Input label="Огноо" name="published_on" type="date" required defaultValue={news?.published_on ?? new Date().toISOString().slice(0, 10)} />
        </Grid>
        <Checkbox label="Сайтад нийтлэх" name="is_published" defaultChecked={news?.is_published ?? true} />
      </Panel>

      <Panel title="Агуулга">
        <Textarea label="Товч агуулга" name="excerpt" required rows={3} defaultValue={news?.excerpt} hint="Нүүр хуудасны картад харагдана" />
        <Textarea label="Хайлтын системийн тайлбар" name="description" rows={2} defaultValue={news?.description} hint="Хоосон бол товч агуулгыг ашиглана" />
        <Textarea label="Тодотгол (эхний тод догол мөр)" name="lead" rows={3} defaultValue={news?.lead} />
        <Textarea label="Үндсэн текст" name="body" rows={8} defaultValue={news?.body.join("\n\n")} hint="Догол мөр бүрийг хоосон мөрөөр тусгаарлана" />
        <Textarea
          label="Тоон үзүүлэлт"
          name="stats"
          rows={4}
          defaultValue={news?.stats?.map((s) => `${s.value} | ${s.label}`).join("\n")}
          hint="Мөр бүрт: утга | тайлбар. Жишээ: 54 | Вагон"
        />
      </Panel>

      <Panel title="Нүүр зураг">
        {news?.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={news.cover.src} alt="" className="h-48 w-full max-w-md rounded-[10px] object-cover" />
        )}
        <Grid>
          <FileInput label={news ? "Нүүр зургийг солих" : "Нүүр зураг"} name="cover_file" required={!news} />
          <Input label="Зургийн тайлбар (alt)" name="cover_alt" defaultValue={news?.cover.alt} hint="Хоосон бол гарчгийг ашиглана" />
          <Input
            label="Зургийн төвлөрөл"
            name="cover_position"
            defaultValue={news?.cover.position}
            hint="Картад зургийн аль хэсэг харагдах. Жишээ: center 60%, 30% center"
          />
        </Grid>
      </Panel>

      <Panel title="Зургийн цомог">
        {gallery.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
            {gallery.map((img, i) => (
              <label key={img.src} className="flex flex-col gap-2 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" className="h-28 w-full rounded-[10px] object-cover" />
                <span className="inline-flex items-center gap-2">
                  <input type="checkbox" name="gallery_remove" value={i} className="size-4 accent-[#c62828]" />
                  Хасах
                </span>
              </label>
            ))}
          </div>
        )}
        <FileInput label="Зураг нэмэх" name="gallery_files" multiple hint="Олон зураг зэрэг сонгож болно" />
      </Panel>
    </AdminForm>
  );
}
