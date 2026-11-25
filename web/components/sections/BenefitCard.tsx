import type { Benefit, BenefitIcon } from "@/content/jobs";

const icons: Record<BenefitIcon, React.ReactNode> = {
  trophy: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />,
  wallet: (
    <>
      <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <path d="M21 7h-6a3 3 0 0 0 0 6h6V7z" />
    </>
  ),
  meal: <path d="M4 3v8a3 3 0 0 0 3 3v7M7 3v6M10 3v8a3 3 0 0 1-3 3M17 21V3c-2 1-3 4-3 8h3" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  growth: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 7-4.6" />
    </>
  ),
};

/** Хар дэвсгэр дээрх хангамжийн карт */
export function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-card border border-white/15 bg-white/6 p-7">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-xl bg-[#4fa3e0]/18 text-accent-dark">
        <svg viewBox="0 0 24 24" className="size-[26px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icons[benefit.icon]}
        </svg>
      </span>
      <h3 className="text-lg font-bold">{benefit.title}</h3>
      <p className="text-[15px] leading-[1.6] text-light">{benefit.text}</p>
    </div>
  );
}
