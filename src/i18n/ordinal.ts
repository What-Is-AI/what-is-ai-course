import type { Locale } from "@/i18n/config";

export function formatOrdinal(n: number, locale: Locale) {
  if (locale === "es") return `${n}.º`;
  if (locale === "lt") return `${n}-as`;
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
