export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="self-start rounded-full bg-sky px-2.5 py-1 text-xs font-semibold text-blue-dark">{children}</span>
  );
}
