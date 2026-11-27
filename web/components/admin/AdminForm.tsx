"use client";

import { useState, useTransition } from "react";
import type { AdminResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { compressImage, imageSize } from "@/lib/compress-image";

/**
 * Админы маягт. Илгээхээс өмнө зургийг шахаж, зураг бүрийн хэмжээг `<name>__size` нэрээр нэмж илгээнэ.
 * Амжилттай бол Server Action өөрөө жагсаалт руу шилжүүлнэ.
 */
export function AdminForm({
  action,
  submitLabel = "Хадгалах",
  children,
}: {
  action: (formData: FormData) => Promise<AdminResult>;
  submitLabel?: string;
  children: React.ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setError(null);

    startTransition(async () => {
      const data = new FormData();
      for (const [key, value] of new FormData(form).entries()) {
        if (!(value instanceof File)) {
          data.append(key, value);
          continue;
        }
        if (value.size === 0) continue;
        const file = await compressImage(value, 2000, 300 * 1024);
        const { width, height } = await imageSize(file).catch(() => ({ width: 0, height: 0 }));
        data.append(key, file);
        data.append(`${key}__size`, `${width}x${height}`);
      }
      try {
        const result = await action(data);
        if (result?.error) setError(result.error);
      } catch (err) {
        // redirect() нь алдаа шидэж шилжилт хийдэг тул түүнийг дахин шиднэ
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
        setError("Хадгалахад алдаа гарлаа. Зургийн хэмжээ их байж магадгүй. Дахин оролдоно уу.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {children}
      {error && (
        <p role="alert" className="rounded-[10px] bg-[#fdecea] px-4 py-3 text-sm font-semibold text-[#c62828]">
          {error}
        </p>
      )}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Хадгалж байна…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
