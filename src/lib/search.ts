import { getCollection } from "astro:content";
import { getContent, localePath, loc, type Lang } from "../i18n/utils";
import { techOf } from "../i18n/stack";

export type Section = "projects" | "technologies" | "research" | "method";

export interface Entry {
  id: string;
  section: Section;
  type: "project" | "technology" | "research" | "method";
  title: string;
  summary: string;
  text: string;
  tags: string[];
  url: string;
}

const join = (...parts: (string | string[] | undefined)[]) =>
  parts.flat().filter(Boolean).join(" ");

export async function buildIndex(lang: Lang): Promise<Entry[]> {
  const c = getContent(lang);
  const [projects, technologies, research] = await Promise.all([
    getCollection("projects"),
    getCollection("technologies"),
    getCollection("research"),
  ]);
  const techTitle = new Map(
    technologies.map((t) => [t.id, t.data[lang].title]),
  );
  const entries: Entry[] = [];

  for (const p of projects) {
    const d = p.data[lang];
    entries.push({
      id: `project:${p.id}`,
      section: "projects",
      type: "project",
      title: d.title,
      summary: d.summary,
      text: join(
        d.subtitle,
        d.goal,
        d.solution,
        d.result,
        d.status,
        d.highlights,
        d.metrics.map((m) => `${m.value} ${m.label}`),
        d.sections.flatMap((s) => [s.title, ...s.body]),
        p.data.models,
      ),
      tags: [
        ...p.data.tech.map((id) => techOf(id, lang).name),
        ...p.data.concepts.map((id) => techTitle.get(id) ?? id),
      ],
      url: localePath(lang, `/projects/${p.id}`),
    });
  }

  for (const t of technologies) {
    const d = t.data[lang];
    entries.push({
      id: `technology:${t.id}`,
      section: "technologies",
      type: "technology",
      title: d.title,
      summary: d.summary,
      text: join(
        d.process ? Object.values(d.process) : undefined,
        d.body,
        t.data.implementations.flatMap((i) => [
          i[lang].summary,
          ...i[lang].notes,
        ]),
      ),
      tags: t.data.implementations.map((i) => techOf(i.language, lang).name),
      url: localePath(lang, `/technologies/${t.id}`),
    });
  }

  for (const r of research) {
    const d = r.data[lang];
    entries.push({
      id: `research:${r.id}`,
      section: "research",
      type: "research",
      title: d.title,
      summary: d.summary,
      text: join(
        d.question,
        d.requirement,
        d.method,
        d.findings,
        d.decision,
        d.limits,
      ),
      tags: [
        loc(r.data.topic, lang),
        ...r.data.technologies.map((id) => techTitle.get(id) ?? id),
      ],
      url: localePath(lang, `/research/${r.id}`),
    });
  }

  const m = c.methodPage;
  const base = localePath(lang, "/method");
  const add = (
    id: string,
    anchor: string,
    title: string,
    summary: string,
    text = "",
  ) =>
    entries.push({
      id: `method:${id}`,
      section: "method",
      type: "method",
      title,
      summary,
      text,
      tags: [],
      url: `${base}#${anchor}`,
    });

  m.stages.forEach((s, i) =>
    add(`stage-${i + 1}`, `stage-${i + 1}`, s.name, s.text, m.stagesTitle),
  );
  add("knowledge", "knowledge", m.knowledgeTitle, m.knowledgeText);
  m.researchRules.forEach((r, i) =>
    add(`rule-${i + 1}`, `rule-${i + 1}`, r, m.researchTitle),
  );
  m.readiness.forEach((r, i) =>
    add(`readiness-${i + 1}`, `readiness-${i + 1}`, r, m.readinessTitle),
  );
  m.publish.forEach((r, i) =>
    add(`publish-${i + 1}`, `publish-${i + 1}`, r, m.publishTitle),
  );
  return entries;
}
