import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { Container } from "@/components/ui/Container";
import { requireAdmin } from "@/lib/admin";

const nav = [
  { href: "/admin/inquiries", label: "Хүсэлт" },
  { href: "/admin/applications", label: "Анкет" },
  { href: "/admin/news", label: "Мэдээ" },
  { href: "/admin/jobs", label: "Ажлын зар" },
  { href: "/admin/offerings", label: "Хөдлөх бүрэлдэхүүн, карт" },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();

  return (
    <Container className="flex flex-col gap-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-white px-5 py-4">
        <nav aria-label="Админ цэс" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/admin" className="text-lg font-extrabold text-navy no-underline">
            Админ
          </Link>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="py-2 text-[15px] font-semibold text-blue-dark no-underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="flex items-center gap-3 text-sm text-muted">
          <span>{email}</span>
          <button type="submit" className="min-h-11 rounded-[10px] border border-line px-4 font-semibold text-navy">
            Гарах
          </button>
        </form>
      </div>
      {children}
    </Container>
  );
}
