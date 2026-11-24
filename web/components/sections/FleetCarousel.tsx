"use client";

import Image from "next/image";
import { useState } from "react";
import type { FleetSlide } from "@/content/fleet";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const SLIDE_SHADE =
  "linear-gradient(to top, rgba(3,21,48,.85) 0%, rgba(3,21,48,0) 55%), linear-gradient(to bottom, rgba(3,21,48,.45) 0%, rgba(3,21,48,0) 25%)";

const peekStyle = (slide: FleetSlide): React.CSSProperties => ({
  backgroundImage: `linear-gradient(rgba(243,246,250,.45), rgba(243,246,250,.45)), url('${slide.image}')`,
});

const arrowClass =
  "absolute top-[218px] hidden size-11 rounded-lg border border-line bg-white text-xl text-navy md:block";

/** "Хүчин чадал" слайдер: сум, цэгээр солих, хажуу талд өмнөх/дараагийн зургийг бүдэг харуулна */
export function FleetCarousel({ slides }: { slides: FleetSlide[] }) {
  const [current, setCurrent] = useState(0);
  const count = slides.length;
  const show = (i: number) => setCurrent((i + count) % count);

  const prev = slides[(current - 1 + count) % count];
  const next = slides[(current + 1) % count];

  return (
    <>
      <div className="relative flex justify-center gap-5 overflow-hidden">
        <div
          className="hidden h-[480px] flex-[0_0_18%] rounded-2xl bg-[#e8edf3] bg-cover bg-center md:block"
          style={count > 1 ? peekStyle(prev) : undefined}
        />

        {slides.map((slide, i) => (
          <div
            key={slide.title}
            role="group"
            aria-roledescription="слайд"
            aria-label={slide.label}
            className={cn(
              "relative h-[480px] min-w-0 flex-[0_0_calc(100%_-_48px)] flex-col justify-between overflow-hidden rounded-2xl bg-navy p-8 md:flex-[0_0_60%]",
              i === current ? "flex" : "hidden",
            )}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              className="object-cover"
              style={{ objectPosition: slide.position }}
            />
            <div className="pointer-events-none absolute inset-0 z-[1]" style={{ backgroundImage: SLIDE_SHADE }} />
            <span className="relative z-[2] text-sm font-semibold text-white">{slide.tag}</span>
            <div className="relative z-[2] flex flex-col gap-4">
              <h3 className="text-[28px] font-extrabold text-white md:text-4xl">{slide.title}</h3>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={slide.rentHref}>Түрээслэх</ButtonLink>
                <ButtonLink href={slide.moreHref} variant="white">
                  Дэлгэрэнгүй
                </ButtonLink>
              </div>
            </div>
          </div>
        ))}

        <div
          className="hidden h-[480px] flex-[0_0_18%] rounded-2xl bg-[#e8edf3] bg-cover bg-center md:block"
          style={count > 1 ? peekStyle(next) : undefined}
        />

        <button
          type="button"
          aria-label="Өмнөх слайд"
          onClick={() => show(current - 1)}
          className={cn(arrowClass, "left-[calc(20%_-_22px)]")}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Дараагийн слайд"
          onClick={() => show(current + 1)}
          className={cn(arrowClass, "right-[calc(20%_-_22px)]")}
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-1 pt-4">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Слайд ${i + 1}`}
            aria-current={i === current}
            onClick={() => show(i)}
            className="flex size-6 items-center justify-center"
          >
            <span className={cn("size-2.5 rounded-full", i === current ? "bg-navy" : "bg-[#b7c3d1]")} />
          </button>
        ))}
      </div>
    </>
  );
}
