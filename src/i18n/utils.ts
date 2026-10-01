import en from "../../content/en.json";
import hu from "../../content/hu.json";

export const languages = { en: "English", hu: "Magyar" } as const;
export type Lang = keyof typeof languages;

const dict = { en, hu };
export const getContent = (lang: Lang) => dict[lang];

export const localePath = (lang: Lang, path = "/") =>
  lang === "en" ? path : `/hu${path}`;

export function switchPath(url: URL, target: Lang) {
  const rest = url.pathname.replace(/^\/hu(?=\/|$)/, "") || "/";
  return localePath(target, rest);
}

export type L10n = string | { en: string; hu: string };
export const loc = (v: L10n, lang: Lang) =>
  typeof v === "string" ? v : v[lang];
