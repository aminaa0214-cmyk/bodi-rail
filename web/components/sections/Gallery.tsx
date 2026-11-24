import Image from "next/image";
import type { NewsImage } from "@/content/news";
import { cn } from "@/lib/cn";

/** Мэдээний зургийн цомог: 2 багана, гар утсан дээр 1 багана */
export function Gallery({ images }: { images: NewsImage[] }) {
  return (
    <div className="my-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((img) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={img.wide ? "(max-width: 908px) 100vw, 860px" : "(max-width: 600px) 100vw, 430px"}
          className={cn("aspect-[4/3] w-full rounded-xl object-cover", img.wide && "sm:col-span-full")}
        />
      ))}
    </div>
  );
}
