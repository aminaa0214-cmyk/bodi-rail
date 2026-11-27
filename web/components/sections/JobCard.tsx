"use client";

import type { Job } from "@/lib/data";
import { APPLY_EVENT } from "@/components/forms/ApplicationForm";
import { buttonClass } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <h4 className="mt-3 mb-1.5 text-sm font-bold text-navy">{title}</h4>
      <ul className="list-disc pl-[18px] text-muted">
        {items.map((item) => (
          <li key={item} className="mb-1">
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

/** Нээлттэй ажлын байрны карт. "Анкет бөглөх" дарахад анкетын албан тушаал сонгогдоно. */
export function JobCard({ job }: { job: Job }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-card border border-ph bg-white p-6">
      <Tag>{job.tag}</Tag>
      <h3 className="text-xl font-bold">{job.title}</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1 text-sm">
        <dt className="text-muted">Ажлын цаг</dt>
        <dd className="font-semibold">{job.hours}</dd>
      </dl>
      <p className="text-sm leading-[1.6] text-muted">{job.summary}</p>
      <details className="text-sm leading-[1.6]">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-blue-dark">Дэлгэрэнгүй</summary>
        <List title="Гүйцэтгэх үндсэн үүрэг" items={job.duties} />
        <List title="Тавигдах шаардлага" items={job.requirements} />
      </details>
      <a
        href="#apply"
        onClick={() => window.dispatchEvent(new CustomEvent(APPLY_EVENT, { detail: job.title }))}
        className={buttonClass({ className: "mt-auto min-h-11 self-start text-sm" })}
      >
        Анкет бөглөх
      </a>
    </article>
  );
}
