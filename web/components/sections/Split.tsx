import Image from "next/image";
import { cn } from "@/lib/cn";
import { Pill } from "@/components/ui/Pill";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** Хоёр баганат хэсэг: нэг талд зураг, нөгөө талд текст. Гар утсан дээр дээш доош байрлана. */
export function Split({ reverse, className, children }: { reverse?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center gap-14 *:min-w-0 *:flex-[1_1_460px]",
        reverse ? "flex-wrap-reverse" : "flex-wrap",
        className,
      )}
    >
      {children}
    </div>
  );
}

type SplitTextProps = {
  pill?: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
};

export function SplitText({ pill, title, className, children }: SplitTextProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[18px] [&>p]:text-base [&>p]:leading-[1.7] [&>p]:text-muted",
        className,
      )}
    >
      {pill && <Pill>{pill}</Pill>}
      <h2 className="text-[30px] font-extrabold md:text-4xl">{title}</h2>
      {children}
    </div>
  );
}

type SplitMediaProps =
  | { src: string; alt: string; width: number; height: number; placeholder?: never }
  | { placeholder: string; src?: never; alt?: never; width?: never; height?: never };

export function SplitMedia(props: SplitMediaProps) {
  if (props.placeholder !== undefined) {
    return <ImagePlaceholder label={props.placeholder} className="h-[420px] rounded-3xl" />;
  }
  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      sizes="(max-width: 900px) 100vw, 50vw"
      className="block h-[420px] w-full rounded-3xl object-cover"
    />
  );
}
