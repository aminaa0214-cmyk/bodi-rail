import { contact } from "@/content/site";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";

/** Зүүн талд тайлбар, баруун талд маягт. `boxed` бол саарал хайрцагтай. */
export function FormSection({ boxed, className, children }: { boxed?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-wrap gap-12", boxed && "rounded-[28px] bg-soft p-6 md:p-12", className)}>
      {children}
    </div>
  );
}

type FormIntroProps = {
  pill: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function FormIntro({ pill, title, description, children }: FormIntroProps) {
  return (
    <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
      <Pill>{pill}</Pill>
      <h2 className="text-[30px] font-extrabold md:text-4xl">{title}</h2>
      <p className="text-base leading-[1.6] text-muted">{description}</p>
      {children}
    </div>
  );
}

/** Утас, и-мэйлтэй цагаан хайрцаг */
export function ContactBox({ phoneLabel = "Утас", showEmail = true }: { phoneLabel?: string; showEmail?: boolean }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-[18px] text-[15px]">
      {phoneLabel}: <b>{contact.phone.display}</b>
      {showEmail && (
        <>
          <br />
          И-мэйл: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </>
      )}
    </div>
  );
}
