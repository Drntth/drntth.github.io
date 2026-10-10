import { getCollection } from "astro:content";
import { groups, techOf } from "../i18n/stack";
import { localePath, type Lang } from "../i18n/utils";

export type GNode = {
  id: string;
  label: string;
  type: "language" | "technology" | "project" | "research";
  href?: string;
};
export type GLink = { source: string; target: string; kind: string };

export async function buildGraph(lang: Lang) {
  const languageIds = new Set(
    groups.find((g) => g.id === "languages")!.items.map((i) => i.id),
  );
  const [techs, projects, research] = await Promise.all([
    getCollection("technologies"),
    getCollection("projects"),
    getCollection("research"),
  ]);

  const nodes = new Map<string, GNode>();
  const links: GLink[] = [];
  const link = (source: string, target: string, kind: string) =>
    links.push({ source, target, kind });

  for (const t of techs) {
    nodes.set(`tech:${t.id}`, {
      id: `tech:${t.id}`,
      label: t.data[lang].title,
      type: "technology",
      href: localePath(lang, `/technologies/${t.id}`),
    });
  }
  for (const p of projects) {
    nodes.set(`proj:${p.id}`, {
      id: `proj:${p.id}`,
      label: p.data.label?.[lang] ?? p.data[lang].title,
      type: "project",
      href: localePath(lang, `/projects/${p.id}`),
    });
  }
  for (const r of research) {
    nodes.set(`res:${r.id}`, {
      id: `res:${r.id}`,
      label: r.data[lang].title,
      type: "research",
      href: localePath(lang, `/research/${r.id}`),
    });
  }

  const langNode = (id: string) => {
    const key = `lang:${id}`;
    if (!nodes.has(key))
      nodes.set(key, {
        id: key,
        label: techOf(id, lang).name,
        type: "language",
      });
    return key;
  };

  for (const t of techs)
    for (const i of t.data.implementations)
      link(langNode(i.language), `tech:${t.id}`, "implements");
  for (const p of projects) {
    for (const c of p.data.concepts)
      link(`tech:${c}`, `proj:${p.id}`, "usedBy");
    for (const id of p.data.tech)
      if (languageIds.has(id)) link(langNode(id), `proj:${p.id}`, "builtWith");
  }
  for (const r of research) {
    for (const t of r.data.technologies)
      link(`res:${r.id}`, `tech:${t}`, "investigates");
    for (const p of r.data.projects)
      link(`res:${r.id}`, `proj:${p}`, "informs");
  }

  return {
    nodes: [...nodes.values()],
    links: links.filter((l) => nodes.has(l.source) && nodes.has(l.target)),
  };
}
