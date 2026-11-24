"use client";

import { useState, useTransition } from "react";
import { sendInquiry } from "@/app/actions/send-inquiry";
import { HONEYPOT_FIELD, type InquiryKind, type InquiryResult } from "@/lib/inquiry";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type InquiryFormProps = {
  kind: InquiryKind;
  submitLabel: string;
  children: React.ReactNode;
};

/** Маягтын бүрхүүл: илгээх, хүлээх төлөв, амжилт/алдааны мессеж */
export function InquiryForm({ kind, submitLabel, children }: InquiryFormProps) {
  const [result, setResult] = useState<InquiryResult>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const res = await sendInquiry(data);
        setResult(res);
        if (res.status === "success") form.reset();
      } catch {
        setResult({ status: "error", message: "Сүлжээний алдаа гарлаа. Дахин оролдоно уу." });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-[2_1_520px] flex-col gap-7 rounded-card bg-white p-6 md:p-8"
    >
      <input type="hidden" name="kind" value={kind} />
      {/* Спам ботын урхи: хүнд харагдахгүй */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Вэбсайт
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {children}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" caps disabled={pending}>
          {pending ? "Илгээж байна…" : submitLabel}
        </Button>
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-[15px] font-semibold",
            result.status === "success" && "text-blue-dark",
            result.status === "error" && "text-[#b42318]",
          )}
        >
          {result.status !== "idle" && result.message}
        </p>
      </div>
    </form>
  );
}
