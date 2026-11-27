import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Нэвтэрсэн, admins хүснэгтэд бүртгэлтэй хэрэглэгч эсэхийг шалгана.
 * Үгүй бол нэвтрэх хуудас руу шилжүүлнэ. Өгөгдлийн сан дахь бүх бичилтийг RLS дахин шалгадаг.
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=forbidden");

  return { supabase, email: String(data.claims.email ?? "") };
}

export const IMAGE_BUCKET = "site-images";

/** Зургийг site-images bucket руу байршуулж, нийтийн URL-ыг буцаана. */
export async function uploadSiteImage(supabase: SupabaseClient, folder: string, file: File) {
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
  if (!ext) throw new Error(`“${file.name}”: зөвхөн JPG, PNG, WEBP зураг оруулна.`);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Зураг байршуулж чадсангүй: ${error.message}`);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** site-images bucket-д байгаа зургуудыг устгана. public/images доторх зургуудад хүрэхгүй. */
export async function removeSiteImages(supabase: SupabaseClient, urls: (string | null | undefined)[]) {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const paths = urls.flatMap((url) => (url && url.includes(marker) ? [url.split(marker)[1]] : []));
  if (paths.length) await supabase.storage.from(IMAGE_BUCKET).remove(paths);
}
