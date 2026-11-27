"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { removeSiteImages, requireAdmin, uploadSiteImage } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminResult = { error: string } | undefined;

// ---------- Туслах ----------

const str = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();
const optional = (fd: FormData, name: string) => str(fd, name) || null;
const bool = (fd: FormData, name: string) => fd.get(name) === "on";
const int = (fd: FormData, name: string) => Number.parseInt(str(fd, name), 10) || 0;
/** Мөр бүрийг нэг элемент болгоно */
const lines = (fd: FormData, name: string) =>
  str(fd, name)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
/** Хоосон мөрөөр тусгаарласан догол мөрүүд */
const paragraphs = (fd: FormData, name: string) =>
  str(fd, name)
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

/** Хөтөч зураг бүрийн хажууд `<name>__size` = "1200x800" илгээдэг (components/admin/AdminForm.tsx) */
function images(fd: FormData, name: string) {
  const files = fd.getAll(name).filter((v): v is File => v instanceof File && v.size > 0);
  const sizes = fd.getAll(`${name}__size`).map(String);
  return files.map((file, i) => {
    const [width, height] = (sizes[i] ?? "").split("x").map(Number);
    return { file, width: width || 1200, height: height || 800 };
  });
}

function fail(err: unknown): AdminResult {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("duplicate key")) return { error: "Ийм утгатай бичлэг аль хэдийн байна (slug эсвэл гарчиг давхцаж байна)." };
  return { error: `Хадгалж чадсангүй: ${message}` };
}

// ---------- Нэвтрэх ----------

export async function signIn(formData: FormData): Promise<AdminResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: str(formData, "email"),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "И-мэйл эсвэл нууц үг буруу байна." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Мэдээ ----------

type NewsImage = { src: string; alt: string; width: number; height: number; wide?: boolean };

export async function saveNews(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const originalSlug = str(formData, "original_slug");
  const slug = str(formData, "slug").toLowerCase();
  const title = str(formData, "title");

  if (!/^[a-z0-9-]+$/.test(slug)) return { error: "Slug зөвхөн латин жижиг үсэг, тоо, зураас (-) агуулна. Жишээ: shine-vagon" };
  if (!title || !str(formData, "excerpt") || !str(formData, "published_on")) {
    return { error: "Гарчиг, огноо, товч агуулгыг бөглөнө үү." };
  }

  try {
    const current = JSON.parse(str(formData, "cover_current") || "null") as (NewsImage & { position?: string }) | null;
    const [coverFile] = images(formData, "cover_file");
    let cover = current;
    if (coverFile) {
      const src = await uploadSiteImage(supabase, `news/${slug}`, coverFile.file);
      cover = { src, alt: "", width: coverFile.width, height: coverFile.height };
    }
    if (!cover) return { error: "Нүүр зургийг оруулна уу." };
    cover = { ...cover, alt: str(formData, "cover_alt") || title, position: optional(formData, "cover_position") ?? undefined };

    // Галерей: хуучнаас сонгосныг хасаж, шинээр нэмсэн зургийг ард нь залгана
    const oldGallery = JSON.parse(str(formData, "gallery_current") || "[]") as NewsImage[];
    const removeIdx = new Set(formData.getAll("gallery_remove").map(Number));
    const gallery = oldGallery.filter((_, i) => !removeIdx.has(i));
    for (const img of images(formData, "gallery_files")) {
      const src = await uploadSiteImage(supabase, `news/${slug}`, img.file);
      gallery.push({ src, alt: title, width: img.width, height: img.height });
    }

    const stats = lines(formData, "stats").map((line) => {
      const [value, ...label] = line.split("|");
      return { value: value.trim(), label: label.join("|").trim() };
    });

    const row = {
      slug,
      published_on: str(formData, "published_on"),
      title,
      excerpt: str(formData, "excerpt"),
      description: str(formData, "description") || str(formData, "excerpt"),
      lead: optional(formData, "lead"),
      body: paragraphs(formData, "body"),
      cover,
      stats: stats.length ? stats : null,
      gallery: gallery.length ? gallery : null,
      is_published: bool(formData, "is_published"),
    };

    const { error } = originalSlug
      ? await supabase.from("news").update(row).eq("slug", originalSlug)
      : await supabase.from("news").insert(row);
    if (error) throw new Error(error.message);

    // Солигдсон, хасагдсан зургийг storage-аас цэвэрлэнэ
    const replaced = [coverFile && current?.src, ...oldGallery.filter((_, i) => removeIdx.has(i)).map((g) => g.src)];
    await removeSiteImages(supabase, replaced);
  } catch (err) {
    return fail(err);
  }

  updateTag("news");
  redirect("/admin/news");
}

export async function deleteNews(slug: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("news").select("cover, gallery").eq("slug", slug).single();
  await supabase.from("news").delete().eq("slug", slug);
  if (data) {
    const gallery = (data.gallery ?? []) as NewsImage[];
    await removeSiteImages(supabase, [data.cover?.src, ...gallery.map((g) => g.src)]);
  }
  updateTag("news");
  redirect("/admin/news");
}

// ---------- Ажлын зар ----------

export async function saveJob(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const row = {
    sort_order: int(formData, "sort_order"),
    tag: str(formData, "tag"),
    title: str(formData, "title"),
    hours: str(formData, "hours"),
    summary: str(formData, "summary"),
    duties: lines(formData, "duties"),
    requirements: lines(formData, "requirements"),
    requires_driver_license: bool(formData, "requires_driver_license"),
    requires_rail_documents: bool(formData, "requires_rail_documents"),
    is_active: bool(formData, "is_active"),
  };
  if (!row.title || !row.tag || !row.hours || !row.summary) {
    return { error: "Албан тушаал, ангилал, ажлын цаг, товч тайлбарыг бөглөнө үү." };
  }

  const { error } = id
    ? await supabase.from("jobs").update(row).eq("id", id)
    : await supabase.from("jobs").insert(row);
  if (error) return fail(error.message);

  updateTag("jobs");
  redirect("/admin/jobs");
}

export async function deleteJob(id: number) {
  const { supabase } = await requireAdmin();
  await supabase.from("jobs").delete().eq("id", id);
  updateTag("jobs");
  redirect("/admin/jobs");
}

// ---------- Ирсэн анкет ----------

export async function updateApplication(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!["new", "reviewed", "rejected", "hired"].includes(status)) return { error: "Төлөвийг сонгоно уу." };

  const { error } = await supabase.from("applications").update({ status, note: optional(formData, "note") }).eq("id", id);
  if (error) return fail(error.message);
  redirect("/admin/applications");
}

export async function deleteApplication(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("applications").select("files").eq("id", id).single();
  const paths = ((data?.files ?? []) as { path: string }[]).map((f) => f.path);
  if (paths.length) await supabase.storage.from("applications").remove(paths);
  await supabase.from("applications").delete().eq("id", id);
  redirect("/admin/applications");
}

// ---------- Маягтаар ирсэн хүсэлт ----------

export async function updateInquiry(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const status = str(formData, "status");
  if (!["new", "contacted", "closed"].includes(status)) return { error: "Төлөвийг сонгоно уу." };

  const { error } = await supabase
    .from("inquiries")
    .update({ status, note: optional(formData, "note") })
    .eq("id", str(formData, "id"));
  if (error) return fail(error.message);
  redirect("/admin/inquiries");
}

export async function deleteInquiry(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("inquiries").delete().eq("id", id);
  redirect("/admin/inquiries");
}

// ---------- Бүтээгдэхүүн, үйлчилгээний карт ----------

export async function saveOffering(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const section = str(formData, "section");
  if (!["home", "sale", "rental"].includes(section)) return { error: "Хэсгийг сонгоно уу." };
  const title = str(formData, "title");
  if (!title) return { error: "Гарчгийг бөглөнө үү." };

  try {
    const currentSrc = optional(formData, "image_current");
    const removeImage = bool(formData, "image_remove");
    const [newImage] = images(formData, "image_file");
    let imageSrc = removeImage ? null : currentSrc;
    if (newImage) imageSrc = await uploadSiteImage(supabase, `offerings/${section}`, newImage.file);

    const row = {
      section,
      sort_order: int(formData, "sort_order"),
      tag: optional(formData, "tag"),
      title,
      body: str(formData, "body").replace(/\r\n/g, "\n") || null,
      details: lines(formData, "details"),
      href: optional(formData, "href"),
      image_src: imageSrc,
      image_alt: imageSrc ? str(formData, "image_alt") || title : null,
      image_position: imageSrc ? optional(formData, "image_position") : null,
      placeholder: optional(formData, "placeholder"),
      is_active: bool(formData, "is_active"),
    };

    const { error } = id
      ? await supabase.from("offerings").update(row).eq("id", id)
      : await supabase.from("offerings").insert(row);
    if (error) throw new Error(error.message);

    if (currentSrc && currentSrc !== imageSrc) await removeSiteImages(supabase, [currentSrc]);
  } catch (err) {
    return fail(err);
  }

  updateTag("offerings");
  redirect("/admin/offerings");
}

export async function deleteOffering(id: number) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("offerings").select("image_src").eq("id", id).single();
  await supabase.from("offerings").delete().eq("id", id);
  await removeSiteImages(supabase, [data?.image_src]);
  updateTag("offerings");
  redirect("/admin/offerings");
}
