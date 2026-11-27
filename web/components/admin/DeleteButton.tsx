"use client";

import { useTransition } from "react";

/** Баталгаажуулалт асуугаад устгах Server Action-ийг дуудна */
export function DeleteButton({ action, label = "Устгах", confirmText }: { action: () => Promise<void>; label?: string; confirmText: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) startTransition(() => action());
      }}
      className="inline-flex min-h-11 items-center rounded-[10px] border border-[#c62828]/40 px-4 text-sm font-semibold text-[#c62828] hover:bg-[#fdecea] disabled:opacity-60"
    >
      {pending ? "Устгаж байна…" : label}
    </button>
  );
}
