import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Нэвтэрсэн хэрэглэгчийн session-тэй Supabase client (админ хуудас, админ Server Action).
 * Хүсэлт бүрт шинээр үүсгэнэ. Нийтийн хуудсууд lib/supabase.ts (кэштэй fetch)-ийг ашиглана.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Server Component дотор cookie бичиж болохгүй. Session-ийг proxy.ts шинэчилдэг тул алгасна.
        }
      },
    },
  });
}
