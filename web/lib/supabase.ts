/**
 * Supabase-ийн REST (PostgREST) болон Storage API-г fetch-ээр дуудах туслах функцууд.
 * Зөвхөн сервер дээр (Server Component, Server Action) ашиглана.
 *
 * Тохиргоо: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (.env.example-ийг үзнэ үү).
 * Publishable key нь зөвхөн RLS-ээр зөвшөөрсөн үйлдлийг хийж чадна:
 * идэвхтэй ажлын зар, карт, мэдээг унших; анкет болон хавсралт нэмэх (уншиж чадахгүй).
 */

/** Сайтын агуулга өгөгдлийн сангаас дахин уншигдах хугацаа (секунд) */
export const CONTENT_REVALIDATE_SECONDS = 60;

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY орчны хувьсагчийг тохируулна уу (.env.example-ийг үзнэ үү).");
  }
  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

async function failure(res: Response, what: string) {
  const detail = await res.text().catch(() => "");
  return new Error(`Supabase ${what} алдаа (${res.status}): ${detail}`);
}

/**
 * Хүснэгтээс мөр уншина. `query` нь PostgREST-ийн query string,
 * жишээ нь "select=*&order=sort_order.asc".
 */
export async function selectRows<T>(table: string, query: string, tags: string[] = [table]): Promise<T[]> {
  const { url, key } = config();
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Accept: "application/json" },
    next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags },
  });
  if (!res.ok) throw await failure(res, `${table} унших`);
  return res.json() as Promise<T[]>;
}

/** Нэг мөр нэмнэ. RLS нь уншихыг хориглодог тул буцаан уншихгүй (return=minimal). */
export async function insertRow(table: string, row: Record<string, unknown>) {
  const { url, key } = config();
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) throw await failure(res, `${table} бичих`);
}

/** Storage bucket руу файл байршуулна. Ижил нэртэй файл байвал алдаа өгнө. */
export async function uploadFile(bucket: string, path: string, file: Blob, contentType: string) {
  const { url, key } = config();
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": contentType, "x-upsert": "false" },
    body: file,
    cache: "no-store",
  });
  if (!res.ok) throw await failure(res, `${bucket}/${path} файл байршуулах`);
}
