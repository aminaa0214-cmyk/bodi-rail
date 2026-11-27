import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

/** Админ хуудасны гарчиг: буцах холбоос, "нэмэх" товч */
export function AdminHeader({
  title,
  backHref,
  newHref,
  newLabel,
  children,
}: {
  title: string;
  backHref?: string;
  newHref?: string;
  newLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        {backHref && (
          <Link href={backHref} className="text-sm font-semibold text-blue-dark">
            ← Буцах
          </Link>
        )}
        <h1 className="text-[28px] font-extrabold text-navy">{title}</h1>
        {children}
      </div>
      {newHref && (
        <Link href={newHref} className={buttonClass()}>
          + {newLabel}
        </Link>
      )}
    </div>
  );
}

export function AdminList({ empty, children }: { empty: string; children: React.ReactNode[] }) {
  if (children.length === 0) return <p className="rounded-card bg-white p-6 text-muted">{empty}</p>;
  return <ul className="flex flex-col divide-y divide-ph overflow-hidden rounded-card border border-ph bg-white">{children}</ul>;
}

export function AdminRow({ title, meta, children }: { title: React.ReactNode; meta?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-bold text-navy [&_a]:text-navy [&_a]:no-underline [&_a:hover]:text-blue-dark">{title}</span>
        {meta && <span className="flex flex-wrap items-center gap-2 text-sm text-muted">{meta}</span>}
      </div>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </li>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#fff4e0] px-2.5 py-0.5 text-xs font-bold text-[#9a5b00]">{children}</span>;
}
