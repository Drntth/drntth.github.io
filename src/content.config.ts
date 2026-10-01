import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const l10n = z.object({ en: z.string(), hu: z.string() });
const links = z.array(z.object({ label: l10n, href: z.string() })).default([]);

const projectText = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  summary: z.string(),
  goal: z.string(),
  solution: z.string(),
  result: z.string(),
  status: z.string(),
  highlights: z.array(z.string()).default([]),
  sections: z
    .array(z.object({ title: z.string(), body: z.array(z.string()) }))
    .default([]),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./content/projects" }),
  schema: z.object({
    order: z.number(),
    visibility: z.enum(["public", "planned"]).default("public"),
    year: z.number().optional(),
    icon: z.string().default("lucide:folder-code"),
    image: z.string().optional(),
    label: l10n.optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    links,
    tech: z.array(z.string()),
    concepts: z.array(z.string()).default([]),
    models: z.array(z.string()).default([]),
    en: projectText,
    hu: projectText,
  }),
});

const certText = z.object({
  title: z.string(),
  summary: z.string(),
  topics: z.array(z.string()),
});
const certificates = defineCollection({
  loader: glob({ pattern: "*.json", base: "./content/certificates" }),
  schema: z.object({
    order: z.number(),
    issuer: z.string(),
    date: z.string(),
    file: z.string(),
    preview: z.string(),
    verifyUrl: z.string().url().optional(),
    en: certText,
    hu: certText,
  }),
});

const techText = z.object({
  title: z.string(),
  summary: z.string(),
  process: z
    .object({
      requirement: z.string(),
      question: z.string(),
      validation: z.string(),
      decision: z.string(),
    })
    .optional(),
  body: z.array(z.string()).default([]),
  planned: z.array(z.string()).default([]),
});
const implText = z.object({
  summary: z.string(),
  notes: z.array(z.string()).default([]),
});

const technologies = defineCollection({
  loader: glob({ pattern: "*.json", base: "./content/technologies" }),
  schema: z.object({
    order: z.number(),
    visibility: z.enum(["published", "planned"]).default("published"),
    icon: z.string().default("lucide:lightbulb"),
    implementations: z
      .array(z.object({ language: z.string(), en: implText, hu: implText }))
      .default([]),
    en: techText,
    hu: techText,
  }),
});

const researchText = z.object({
  title: z.string(),
  summary: z.string(),
  question: z.string().optional(),
  findings: z.array(z.string()).default([]),
  planned: z.array(z.string()).default([]),
  examples: z.array(z.string()).default([]),
});

const research = defineCollection({
  loader: glob({ pattern: "*.json", base: "./content/research" }),
  schema: z.object({
    order: z.number(),
    visibility: z.enum(["published", "planned"]).default("planned"),
    icon: z.string().default("lucide:flask-conical"),
    topic: l10n,
    technologies: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    links,
    en: researchText,
    hu: researchText,
  }),
});

export const collections = { projects, certificates, technologies, research };
