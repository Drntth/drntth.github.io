# AGENTS.md

Guide for AI assistants working on this repository. Read it fully before changing anything.

## 1. Purpose

`drntth.github.io` is the curated professional portfolio of Tóth Dorina Ildikó (software developer, AI and backend), published on GitHub Pages at https://drntth.github.io/.

It is a curated portfolio. It is not a copy of a private workspace and not an engineering log.

## 2. Collaboration preferences

- The owner communicates in Hungarian. Reply in Hungarian unless asked otherwise. Code, identifiers and this file stay in English.
- Style: concise, technical, neutral, structured (headings, lists). No emojis, no filler, no greetings.
- Ask when a task is ambiguous or when a fact is missing. Never invent personal, professional or technical facts. Anything not listed in section 9 or confirmed by the owner is unverified: mark it or ask.
- Do not rewrite whole files when a small diff is enough. Show changed parts and say where they go.

## 3. Stack

- Astro 7 (static output, GitHub Pages) with Vite 8. Node 22.12 or newer is required.
- Tailwind CSS v4 through `@tailwindcss/vite`. Design tokens are CSS variables.
- Icons: `astro-icon` with `simple-icons`, `mdi`, `lucide`. No emojis anywhere.
- Fonts: `@fontsource-variable/inter` (body), `@fontsource-variable/space-grotesk` (display), self-hosted.
- Carousel: Embla (autoplay, wheel gestures). Background particles: tsParticles slim (v3). Graph: `d3-force`.
- Content: Astro content collections (JSON, glob loader) in `content/`.
- SEO: `@astrojs/sitemap`, JSON-LD, Open Graph, hreflang.
- Dev scripts: `scripts/favicon.mjs`, `scripts/og.mjs` (use `sharp`).

## 4. Commands

```bash
npm install
npm run dev          # or: astro dev --background (see Development block at the end)
npm run build        # must pass before every push
npm run preview
node scripts/favicon.mjs   # regenerate favicons from src/assets/avatar.jpg
node scripts/og.mjs        # regenerate public/og.png
```

Certificate preview from PDF (poppler):

```bash
pdftoppm -png -r 90 -f 1 -l 1 -singlefile public/certs/<name>.pdf public/certs/<name>
```

## 5. Repository layout

```
content/                  all text and data (edit here, not in components)
  en.json, hu.json        site-wide strings per language
  stack.json              shared technology catalogue with icons
  projects/*.json         projects (collection "projects")
  technologies/*.json     technology nodes (collection "technologies")
  research/*.json         research entries (collection "research")
  certificates/*.json     certificates (collection "certificates")
public/                   static files: cv/, certs/, favicons, og.png, robots.txt
scripts/                  one-off asset generators
src/
  assets/avatar.jpg       hero image, source of favicon and OG avatar
  components/             Background, Carousel, Header, KnowledgeGraph, ResearchFlow, TechChip
  i18n/utils.ts           getContent, localePath, switchPath, loc
  i18n/stack.ts           stack groups and techOf(id, lang)
  layouts/BaseLayout.astro  head, SEO, JSON-LD, footer, reveal observer
  lib/graph.ts            builds the knowledge graph from collections
  pages/                  thin wrappers only; hu/ mirrors the English tree
  styles/global.css       tokens and shared classes
  views/                  real page markup shared by EN and HU
  content.config.ts       collection schemas (source of truth for fields)
```

## 6. Architecture rules

**i18n**
- English is the default locale without prefix (`/`), Hungarian lives under `/hu/`.
- A page is a view in `src/views/` plus two wrappers: `src/pages/<name>.astro` (`lang="en"`) and `src/pages/hu/<name>.astro` (`lang="hu"`). Dynamic routes use `[slug].astro` in both trees.
- Every user-visible string lives in `content/*.json`, with both `en` and `hu`. Never hardcode text in components (the bilingual 404 page is the only exception).
- Always build links with `localePath(lang, path)`, and switch language with `switchPath`.

**Content model**
- Technology ids in `tech`, `concepts`, `implementations[].language` refer to ids in `content/stack.json` or to technology node slugs. Unknown ids fall back to a generic icon.
- `projects[].visibility`: `public` appears on Home, Projects and detail pages. `planned` appears only in the knowledge graph.
- `technologies[].visibility` and `research[].visibility`: `published` or `planned`. Planned entries must be visibly marked and describe intended content, not fake results.
- Schemas are defined in `src/content.config.ts`. Change the schema first, then the data, then the views.

**Knowledge model** (Technologies page)
```
Programming Language --implements--> Technology / Concept --used by--> Project
```
- A technology node describes the general concept. The language entry (`implementations`) describes how it is implemented in one language. The project describes how it uses both. Project-specific implementation must not leak into the general node.
- Research starts from a concrete project requirement, covers only what the project needs, and never reproduces full technology documentation. Flow: requirement, unknown question, required technology, relevant concepts, targeted research, prototype/validation, decision, node or project documentation.
- The graph is generated from the collections (`src/lib/graph.ts`). Node size comes from the number of connections. Do not add manual node lists.

**Styling**
- Tokens in `global.css`: `--accent` (purple), `--accent-2` (red), `--bg`, `--surface`, `--fg`, `--muted`, `--line`. Purple and red must stay balanced; use gradients and alternate the two.
- Shared classes: `.card`, `.chip`, `.btn`, `.btn-primary`, `.btn-ghost`, `.icon-btn`, `.section-title`, `.text-gradient`, `.reveal`.
- Dark mode is the `.dark` class on `<html>`. The toggle dispatches `themechange`; `Background.astro` listens to recolor particles.
- Respect `prefers-reduced-motion` (reveal animations, autoplay, particles, graph drag are disabled).
- Background: static gradient glows (`.bg-glows`) plus a faint mouse-reactive particle layer. Keep it subtle.

**Header**: anchor links to Home sections (`#about`, `#stack`, `#certificates`, `#contact`), page links (Projects, Technologies, Research), hamburger menu below `lg`, language switch, theme icon toggle, CV download.

**SEO**: `BaseLayout` props `title`, `description`, `keywords`, `type`, `noindex`, `jsonLd`. Person JSON-LD is global. `og.png` is 1200x630. The `keywords` meta tag has no ranking effect on Google; title, description, headings, hreflang, sitemap and JSON-LD matter.

## 7. How to extend

| Task | Steps |
| --- | --- |
| Add a project | Create `content/projects/<slug>.json` per schema (both languages). Use ids from `stack.json` in `tech`. Optional `image`, `repo`, `demo`, `links`, `models`, `concepts`. Detail page, Home carousel and graph update automatically. |
| Add a stack item | Add `{ id, name, icon }` to a group in `content/stack.json`. |
| Add a technology node | Create `content/technologies/<slug>.json`. Fill `implementations` per language. Reference it from a project via `concepts`. |
| Add research | Create `content/research/<slug>.json`. Link `technologies` and `projects`. Keep `visibility: planned` until real content exists. |
| Add a certificate | Put PDF in `public/certs/`, generate the PNG preview, add `content/certificates/<slug>.json`. |
| Add a page | View, two wrappers, header link, `nav` key in both JSON files, check the sitemap. |
| Add a string | Add the key to both `en.json` and `hu.json`. |
| Change colors | Edit tokens in `global.css` only. |

## 8. Content rules (decided with the owner)

- Publish only public, professionally relevant projects. One project is published now: the BSc thesis.
- Employer work is confidential (non-disclosure agreement). Describe only technology areas used (LLM, RAG, OCR, prompt engineering, SAT-based optimization and similar). Do not name concrete internal projects, systems, users or results.
- Private research is never published automatically. Research entries need standalone professional value.
- No percentage or ranking of skills. No radar charts with scores. The knowledge graph shows relationships, not levels.
- Technologies listed must be ones the owner confirmed using. Do not add libraries because they are common.
- Name policy: full name "Tóth Dorina Ildikó" in the hero, footer and CV; short form (`hero.shortName`: "Dorina Tóth" in EN, "Tóth Dorina" in HU) in titles, descriptions, header brand, `og:site_name` and READMEs. JSON-LD `name` is "Dorina Tóth" with the other forms as `alternateName`.
- Title is "Software Developer – AI & Backend" (no "Junior").
- Keep the page short and scannable. Detailed notes belong to Technologies, Research and project detail pages.
- Not published: phone number, birth date, address.
- Licensing: code is MIT (`LICENSE`); `content/`, `public/` and `src/assets/` are all rights reserved (`CONTENT_LICENSE.md`). Do not move personal content into code paths.

## 9. Confirmed facts

**Person**: BSc in Software Engineering (Programtervező informatikus), Eszterházy Károly Catholic University, 2022-2025. Technician in computer system maintenance, Váci SZC Petőfi Sándor Technical School, 2018-2022. Languages: Hungarian (native), English (intermediate), German (basic).

**Experience**: Software Developer, Eszterházy Károly Catholic University IT Development Department, 2025-present (AI systems in Python; LLM, RAG, embeddings, prompt engineering, fine-tuning, OCR with Tesseract plus AI vision, document processing, SAT-based constraint optimization; experimenting with agent frameworks). Teaching assistant (C#, agile methods), 2023-2024. Web developer for Kepes György College (also external communication group lead, financial officer and secretary), 2022-2025.

**Thesis project** (`thesis-langmodels-project-management`): title "Mesterséges intelligencia a webalkalmazásokban", subtitle "Nyelvi modellek a projektmenedzsmentben", 2025. Django, Python, SQLite, Bootstrap, JavaScript, Docker, Cypress, Hugging Face pipelines. Models: DistilGPT2, GPT-Neo 125M, Facebook OPT 125M and 350M, GPT-2 Medium. 248 unit tests and 258 Cypress end-to-end tests, all passing. Four permission levels. Markdown export compatible with GitHub. Docker Hub: https://hub.docker.com/r/drntth/thesis-langmodels-project-management. No demo, no screenshots yet, thesis PDF not in the repo.

**Certificates** (both AWS Training and Certification, completed 2026-09-24): "AWS Foundations: Machine Learning Basics", "Fundamentals of Machine Learning and Artificial Intelligence".

**Stack decisions**: languages Python, Java, C#, TypeScript, JavaScript, SQL, PHP. Frontend: React, Astro, Tailwind CSS, Bootstrap. Databases PostgreSQL, MySQL, SQLite, MongoDB. pgvector is a PostgreSQL extension, listed under AI. AI tools: Ollama, Hugging Face Transformers, LangGraph, pgvector, PyTorch, OpenAI API, Anthropic API, Tesseract. Explicitly not claimed: LangChain, LlamaIndex, llama.cpp, ChromaDB, FAISS, Sentence Transformers, scikit-learn.

## 10. Status

Done:
- Bilingual site (EN/HU), light/dark theme, hamburger header with anchors, particle background, Embla carousels (featured projects, certificates), icon-based stack cards, Projects list and detail pages, Technologies page with method diagram, knowledge graph and node pages, Research page (planned structure), 404, SEO, sitemap, favicon, OG image, GitHub Pages workflow.

Open:
- [ ] Replace placeholders (`game-project`, `branching`) or keep clearly marked as planned.
- [ ] Owner to rewrite research questions and planned texts in own words.
- [ ] Owner to confirm: employer name visibility, experience wording, project result/status fields.
- [ ] Add project images or screenshots, thesis PDF link if allowed by the university.
- [ ] Verify icon names that fail at build (see icones.js.org).
- [ ] Optional ideas: "Currently" section on Home, print stylesheet, Lighthouse CI in Actions, language suggestion banner (suggest, do not redirect), license decision.
- [ ] Final README pass after the site is stable.

## 11. Known pitfalls

- Schema `z` is imported from `astro/zod` (not from `astro:content`). Astro 7 requires Node 22.12+.
- Markdown inside HTML blocks on GitHub needs a blank line after the opening tag (matters for READMEs, not the site).
- GitHub Pages serves only the root `404.html`.
- Icon names (`mdi`, `lucide`, `simple-icons`) change between versions; a wrong name fails the build.
- tsParticles uses the v3 API (`@tsparticles/engine`, `@tsparticles/slim`).
- Embla wheel plugin handles horizontal gestures only; vertical page scroll must keep working.
- Do not commit `dist/`, `node_modules/`, `.astro/`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)