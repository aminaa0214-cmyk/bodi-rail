"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, type NavItem } from "@/content/site";
import { languageOptions, defaultLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Brand } from "./Brand";

function isActive(item: NavItem, pathname: string) {
  return item.activePrefix ? pathname.startsWith(item.activePrefix) : false;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Хуудас солигдоход гар утасны цэсийг хаана
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="bg-navy px-6 pt-6">
      <nav
        aria-label="Үндсэн цэс"
        className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-3xl bg-white py-3 pr-4 pl-6 shadow-[0_10px_30px_rgba(0,0,0,.25)]"
      >
        <Brand />

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-white md:hidden"
          aria-expanded={open}
          aria-controls="main-nav-links"
          aria-label={open ? "Цэс хаах" : "Цэс нээх"}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <div
          id="main-nav-links"
          className={cn(
            "w-full flex-col md:flex md:w-auto md:flex-row md:flex-wrap md:gap-x-7",
            open ? "flex" : "hidden",
          )}
        >
          {mainNav.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-3 text-[15px] font-medium text-navy no-underline",
                  active && "border-b-2 border-blue-dark font-bold text-blue-dark",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className={cn("rounded-full bg-[#eef2f7] p-[3px] md:flex", open ? "flex" : "hidden")}>
          {languageOptions.map((lang) => {
            const current = lang.code === defaultLocale;
            return (
              <button
                key={lang.code}
                type="button"
                aria-pressed={current}
                disabled={!lang.ready}
                title={lang.ready ? undefined : "Удахгүй"}
                className={cn(
                  "min-h-10 rounded-full px-4 text-[13px] font-semibold text-muted disabled:opacity-60",
                  current && "bg-white text-blue-dark shadow-[0_1px_3px_rgba(0,0,0,.12)]",
                )}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
