/** Зөв тэмдэгтэй жагсаалт */
export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-[15px]">
      {items.map((item) => (
        <li key={item} className="relative pl-[30px]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="absolute top-0.5 left-0 size-5 text-blue-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Тээврийн чиглэлүүд */
export function RouteChips({ routes }: { routes: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {routes.map((route) => (
        <span key={route} className="rounded-lg border border-ph bg-soft px-3 py-2 text-sm">
          {route}
        </span>
      ))}
    </div>
  );
}

/** Хар дэвсгэр дээрх карт (нэмэлт үйлчилгээ) */
export function DarkCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-white/15 bg-white/6 p-8 text-[15px] leading-[1.6] text-light">
      <h3 className="text-[22px] font-bold text-white">{title}</h3>
      {children}
    </div>
  );
}
