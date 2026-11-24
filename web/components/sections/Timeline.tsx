export function Timeline({ items }: { items: { year: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-6">
      {items.map((item) => (
        <div key={item.year} className="flex flex-col gap-2.5 border-t-2 border-[#4fa3e0] pt-5">
          <div className="text-[22px] font-extrabold text-accent-dark">{item.year}</div>
          <div className="text-[15px] leading-[1.6] text-light">{item.text}</div>
        </div>
      ))}
    </div>
  );
}
