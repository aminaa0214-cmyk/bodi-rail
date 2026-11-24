import Image from "next/image";
import type { Partner } from "@/content/partners";
import { cn } from "@/lib/cn";

export function LogoGrid({ partners, className }: { partners: Partner[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[repeat(auto-fit,minmax(min(100%,140px),1fr))] gap-4", className)}>
      {partners.map((p) => (
        <div key={p.name} className="relative h-[104px] overflow-hidden rounded-2xl border border-ph bg-white">
          <Image
            src={p.logo}
            alt={p.name}
            fill
            sizes="240px"
            className={cn("object-contain p-[18px]", p.zoom && "scale-160")}
          />
        </div>
      ))}
    </div>
  );
}

export function PartnerGroup({ label, partners }: { label: string; partners: Partner[] }) {
  return (
    <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-4">
      <div className="text-sm font-bold uppercase tracking-[.08em] text-muted">{label}</div>
      <LogoGrid partners={partners} />
    </div>
  );
}
