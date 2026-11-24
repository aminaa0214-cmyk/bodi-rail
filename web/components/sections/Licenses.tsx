"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LICENSE_IMAGE_SIZE, type License } from "@/content/licenses";
import { AutoGrid } from "@/components/ui/AutoGrid";
import { Watermark } from "./Watermark";

const preventMenu = (e: React.MouseEvent) => e.preventDefault();

/** Тусгай зөвшөөрлийн картууд + томоор харах цонх (татаж авах холбоосгүй, усан тэмдэгтэй) */
export function Licenses({ items }: { items: License[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<License | null>(null);

  function open(license: License) {
    setSelected(license);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <AutoGrid min={380}>
        {items.map((license) => (
          <article key={license.number} className="flex items-stretch overflow-hidden rounded-card border border-ph bg-white">
            <button
              type="button"
              onClick={() => open(license)}
              onContextMenu={preventMenu}
              aria-label={`${license.title} — томоор харах`}
              className="group relative block h-[230px] w-[163px] flex-[0_0_163px] cursor-zoom-in overflow-hidden border-r border-ph bg-soft p-0"
            >
              <Image
                src={license.image}
                alt={license.alt}
                {...LICENSE_IMAGE_SIZE}
                sizes="163px"
                draggable={false}
                className="protected size-full object-cover object-top"
              />
              <Watermark small />
              <span className="absolute inset-x-2 bottom-2 z-[2] rounded-lg bg-navy px-2 py-1.5 text-center text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Томоор харах
              </span>
            </button>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5">
              <h3 className="text-[17px] font-bold">{license.title}</h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1 text-[13px]">
                <dt className="text-muted">Олгосон</dt>
                <dd className="font-semibold">{license.issuer}</dd>
                <dt className="text-muted">Дугаар</dt>
                <dd className="font-semibold">{license.number}</dd>
                <dt className="text-muted">Хугацаа</dt>
                <dd className="font-semibold">{license.validity}</dd>
              </dl>
            </div>
          </article>
        ))}
      </AutoGrid>

      <dialog
        ref={dialogRef}
        aria-label="Тусгай зөвшөөрөл"
        onClick={(e) => e.target === e.currentTarget && close()}
        onContextMenu={preventMenu}
        onClose={() => setSelected(null)}
        className="m-auto max-h-[94vh] w-[min(92vw,760px)] overflow-auto rounded-xl bg-white p-0 backdrop:bg-navy/85"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Хаах"
          className="sticky top-2 z-[3] float-right mt-2 mr-2 -mb-[52px] size-11 rounded-full bg-navy text-lg text-white"
        >
          ✕
        </button>
        <div className="relative overflow-hidden">
          {selected && (
            <Image
              src={selected.image}
              alt={selected.alt}
              {...LICENSE_IMAGE_SIZE}
              sizes="(max-width: 826px) 92vw, 760px"
              draggable={false}
              className="protected block h-auto w-full"
            />
          )}
          <Watermark />
        </div>
      </dialog>
    </>
  );
}
