"use client";

import { useState, useTransition } from "react";
import { signIn } from "@/app/admin/actions";
import { Input } from "@/components/admin/fields";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-4 rounded-card border border-ph bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await signIn(data);
          if (result?.error) setError(result.error);
        });
      }}
    >
      <Input label="И-мэйл" name="email" type="email" required autoComplete="username" />
      <Input label="Нууц үг" name="password" type="password" required autoComplete="current-password" />
      {error && (
        <p role="alert" className="text-sm font-semibold text-[#c62828]">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </Button>
    </form>
  );
}
