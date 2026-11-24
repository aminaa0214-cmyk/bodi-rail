import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class-уудыг нийлүүлнэ. Давхардсан бол сүүлийнх нь давамгайлна. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
