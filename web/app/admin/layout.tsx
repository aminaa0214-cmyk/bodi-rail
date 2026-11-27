import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админ",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[70vh] bg-soft">{children}</div>;
}
