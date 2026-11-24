import { cn } from "@/lib/cn";

export type Step = { title: string; text: string };

function StepNumber({ n, small }: { n: number; small?: boolean }) {
  return (
    <span
      className={cn(
        "flex flex-none items-center justify-center rounded-full bg-navy font-extrabold text-white",
        small ? "size-9 text-sm" : "size-11",
      )}
    >
      {n}
    </span>
  );
}

/** Хэвтээ алхмууд (цагаан картууд) */
export function Steps({ items }: { items: Step[] }) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-6">
      {items.map((step, i) => (
        <li key={step.title} className="flex flex-col gap-2.5 rounded-2xl bg-white p-7">
          <StepNumber n={i + 1} />
          <h3 className="text-lg font-bold">{step.title}</h3>
          <p className="text-sm leading-[1.6] text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Босоо алхмууд (маягтын тайлбар хэсэгт) */
export function StepList({ items }: { items: Step[] }) {
  return (
    <ol className="flex flex-col gap-4 pt-2">
      {items.map((step, i) => (
        <li key={step.title} className="flex items-start gap-3.5">
          <StepNumber n={i + 1} small />
          <div>
            <strong className="block text-[15px]">{step.title}</strong>
            <span className="text-sm text-muted">{step.text}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
