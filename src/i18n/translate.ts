import enCore from "../../messages/en.json";
import esCore from "../../messages/es.json";
import ltCore from "../../messages/lt.json";
import enWorkingWithLlms from "../../messages/working-with-llms/en.json";
import esWorkingWithLlms from "../../messages/working-with-llms/es.json";
import ltWorkingWithLlms from "../../messages/working-with-llms/lt.json";
import enDelegateRealWork from "../../messages/delegate-real-work/en.json";
import esDelegateRealWork from "../../messages/delegate-real-work/es.json";
import ltDelegateRealWork from "../../messages/delegate-real-work/lt.json";
import enPractical1 from "../../messages/practical-1/en.json";
import esPractical1 from "../../messages/practical-1/es.json";
import ltPractical1 from "../../messages/practical-1/lt.json";
import enLesson5 from "../../messages/lesson5/en.json";
import esLesson5 from "../../messages/lesson5/es.json";
import ltLesson5 from "../../messages/lesson5/lt.json";
import enLesson6 from "../../messages/lesson6/en.json";
import esLesson6 from "../../messages/lesson6/es.json";
import ltLesson6 from "../../messages/lesson6/lt.json";
import enLesson7 from "../../messages/lesson7/en.json";
import esLesson7 from "../../messages/lesson7/es.json";
import ltLesson7 from "../../messages/lesson7/lt.json";
import enLesson8 from "../../messages/lesson8/en.json";
import esLesson8 from "../../messages/lesson8/es.json";
import ltLesson8 from "../../messages/lesson8/lt.json";
import enWhenItGoesLooking from "../../messages/when-it-goes-looking/en.json";
import esWhenItGoesLooking from "../../messages/when-it-goes-looking/es.json";
import ltWhenItGoesLooking from "../../messages/when-it-goes-looking/lt.json";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

// Message trees include nested objects and arrays (challenge options, hops, …).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict = Record<string, any>;

function mergeMessages(...packs: Dict[]): Dict {
  return Object.assign({}, ...packs);
}

function asDict(pack: unknown): Dict {
  return pack as Dict;
}

const MESSAGES: Record<Locale, Dict> = {
  en: mergeMessages(
    asDict(enCore),
    asDict(enWorkingWithLlms),
    asDict(enDelegateRealWork),
    asDict(enPractical1),
    asDict(enLesson5),
    asDict(enLesson6),
    asDict(enLesson7),
    asDict(enLesson8),
    asDict(enWhenItGoesLooking),
  ),
  es: mergeMessages(
    asDict(esCore),
    asDict(esWorkingWithLlms),
    asDict(esDelegateRealWork),
    asDict(esPractical1),
    asDict(esLesson5),
    asDict(esLesson6),
    asDict(esLesson7),
    asDict(esLesson8),
    asDict(esWhenItGoesLooking),
  ),
  lt: mergeMessages(
    asDict(ltCore),
    asDict(ltWorkingWithLlms),
    asDict(ltDelegateRealWork),
    asDict(ltPractical1),
    asDict(ltLesson5),
    asDict(ltLesson6),
    asDict(ltLesson7),
    asDict(ltLesson8),
    asDict(ltWhenItGoesLooking),
  ),
};

function lookupNode(
  dict: Dict,
  path: string,
): string | Dict | undefined {
  let current: string | Dict | undefined = dict;
  for (const part of path.split(".")) {
    if (!current || typeof current === "string") return undefined;
    current = current[part];
  }
  return current;
}

function lookup(dict: Dict, path: string): string | undefined {
  const node = lookupNode(dict, path);
  return typeof node === "string" ? node : undefined;
}

/** Nested message object for a locale (falls back to default locale). */
export function getMessageNode<T = Dict>(
  locale: Locale,
  path: string,
): T | undefined {
  const node =
    lookupNode(MESSAGES[locale], path) ??
    (locale === DEFAULT_LOCALE
      ? undefined
      : lookupNode(MESSAGES[DEFAULT_LOCALE], path));
  if (node == null || typeof node === "string") return undefined;
  return node as T;
}

export function interpolate(
  template: string,
  vars?: Record<string, string | number>,
) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    vars[key] == null ? match : String(vars[key]),
  );
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
) {
  const message =
    lookup(MESSAGES[locale], key) ??
    (locale === DEFAULT_LOCALE
      ? undefined
      : lookup(MESSAGES[DEFAULT_LOCALE], key));
  if (message == null) return key;
  return interpolate(message, vars);
}

export function translateOptional(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
) {
  const message =
    lookup(MESSAGES[locale], key) ??
    (locale === DEFAULT_LOCALE
      ? undefined
      : lookup(MESSAGES[DEFAULT_LOCALE], key));
  if (message == null) return undefined;
  return interpolate(message, vars);
}

export type Translate = typeof translate;
