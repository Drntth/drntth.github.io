import en from "../../content/en.json";
import hu from "../../content/hu.json";

export const languages = { en: "English", hu: "Magyar" } as const;
export type Lang = keyof typeof languages;

const dict = { en, hu };
export const getContent = (lang: Lang) => dict[lang];

// Internal paths end with "/" to match the canonical URLs and the sitemap
// (build.format "directory"); GitHub Pages would otherwise 301-redirect.
export const localePath = (lang: Lang, path = "/") => {
  const p = path.endsWith("/") ? path : `${path}/`;
  return lang === "en" ? p : `/hu${p}`;
};

export function switchPath(url: URL, target: Lang) {
  const rest = url.pathname.replace(/^\/hu(?=\/|$)/, "") || "/";
  return localePath(target, rest);
}

export type L10n = string | { en: string; hu: string };
export const loc = (v: L10n, lang: Lang) =>
  typeof v === "string" ? v : v[lang];
