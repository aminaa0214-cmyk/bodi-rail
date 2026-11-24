/**
 * Хэлний тохиргоо.
 *
 * Одоохондоо зөвхөн монгол хэл (`mn`) идэвхтэй, URL-д угтвар байхгүй (/hudaldaa).
 * Англи хувилбар нэмэхдээ:
 *   1. `locales`-д "en" нэмнэ.
 *   2. `content/` доторх өгөгдлийг хэлээр нь салгана (content/mn, content/en).
 *   3. next-intl-ийг `localePrefix: "as-needed"` тохиргоотой суулгавал
 *      монгол хуудсууд /hudaldaa хэвээр, англи нь /en/hudaldaa болно.
 */
export const locales = ["mn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "mn";

/** Хэл сонгох товчинд харагдах бүх хэл. `ready: false` бол идэвхгүй харагдана. */
export const languageOptions = [
  { code: "mn", label: "MN", ready: true },
  { code: "en", label: "EN", ready: false },
] as const;
