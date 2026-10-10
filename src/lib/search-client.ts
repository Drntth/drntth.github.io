import MiniSearch from "minisearch";
import type { Entry, Section } from "./search";

type Doc = Entry & { tagsText: string };
export type Hit = Pick<
  Entry,
  "id" | "section" | "type" | "title" | "summary" | "tags" | "url"
> & { score: number };

const norm = (t: string) =>
  t
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
const cache = new Map<string, Promise<MiniSearch<Doc>>>();

export function loadIndex(lang: string) {
  let p = cache.get(lang);
  if (!p) {
    p = fetch(`/search/${lang}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<Entry[]>;
      })
      .then((entries) => {
        const ms = new MiniSearch<Doc>({
          fields: ["title", "tagsText", "summary", "text"],
          storeFields: ["section", "type", "title", "summary", "tags", "url"],
          processTerm: norm,
          searchOptions: {
            processTerm: norm,
            prefix: true,
            fuzzy: 0.2,
            combineWith: "AND",
            boost: { title: 3, tagsText: 2, summary: 1.5 },
          },
        });
        ms.addAll(entries.map((e) => ({ ...e, tagsText: e.tags.join(" ") })));
        return ms;
      });
    cache.set(lang, p);
  }
  return p;
}

export async function search(
  lang: string,
  query: string,
  scope?: Section | null,
  limit = 20,
): Promise<Hit[]> {
  const q = query.trim();
  if (!q) return [];
  const ms = await loadIndex(lang);
  const res = ms.search(
    q,
    scope ? { filter: (r) => r.section === scope } : undefined,
  );
  return res.slice(0, limit) as unknown as Hit[];
}
