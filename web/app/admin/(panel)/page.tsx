import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin();
  const count = async (table: string) => (await supabase.from(table).select("*", { count: "exact", head: true })).count ?? 0;
  const countNew = async (table: string) =>
    (await supabase.from(table).select("*", { count: "exact", head: true }).eq("status", "new")).count ?? 0;
  const [news, jobs, offerings, newApplications, newInquiries] = await Promise.all([
    count("news"),
    count("jobs"),
    count("offerings"),
    countNew("applications"),
    countNew("inquiries"),
  ]);

  const cards = [
    {
      href: "/admin/inquiries?status=new",
      title: "Ирсэн хүсэлт",
      count: newInquiries,
      unit: "шинэ хүсэлт",
      text: "Түрээс, худалдаа, тээврийн захиалгын маягтаар ирсэн хүсэлт",
    },
    {
      href: "/admin/applications?status=new",
      title: "Ирсэн анкет",
      count: newApplications,
      unit: "шинэ анкет",
      text: "Онлайн анкетаар ирсэн өргөдөл, хавсралт. Төлөв, тэмдэглэл хөтлөх",
    },
    { href: "/admin/news", title: "Мэдээ", count: news, text: "Мэдээ нэмэх, засах, нуух, устгах" },
    { href: "/admin/jobs", title: "Ажлын зар", count: jobs, text: "Нээлттэй ажлын байр. Анкетын албан тушаалын сонголт мөн эндээс" },
    {
      href: "/admin/offerings",
      title: "Хөдлөх бүрэлдэхүүн, карт",
      count: offerings,
      text: "Худалдах, түрээслүүлэх зүтгүүр, вагон болон нүүр хуудасны үйлчилгээний картууд",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="flex flex-col gap-2 rounded-card border border-ph bg-white p-6 text-navy no-underline hover:border-blue">
          <span className="text-[13px] font-bold uppercase tracking-[.08em] text-blue-dark">{card.count} {"unit" in card ? card.unit : "бичлэг"}</span>
          <span className="text-xl font-extrabold">{card.title}</span>
          <span className="text-sm text-muted">{card.text}</span>
        </Link>
      ))}
    </div>
  );
}
