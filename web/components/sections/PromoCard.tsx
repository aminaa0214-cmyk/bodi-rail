import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

type PromoCardProps = {
  title: string;
  text: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string; width: number; height: number; position: string };
};

/** Саарал дэвсгэртэй, баруун талдаа зурагтай карт (ажлын байр, үнийн санал) */
export function PromoCard({ title, text, cta, image }: PromoCardProps) {
  return (
    <div className="flex flex-wrap overflow-hidden rounded-2xl bg-soft">
      <div className="flex flex-[1_1_260px] flex-col gap-3 p-10">
        <h3 className="text-[28px] font-bold">{title}</h3>
        <p className="text-base leading-[1.6] text-muted">{text}</p>
        <ButtonLink href={cta.href} variant="white" size="sm" className="mt-2 self-start">
          {cta.label}
        </ButtonLink>
      </div>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 900px) 100vw, 240px"
        className="block h-auto min-h-[240px] w-[38%] min-w-[200px] flex-[0_1_38%] object-cover"
        style={{ objectPosition: image.position }}
      />
    </div>
  );
}
