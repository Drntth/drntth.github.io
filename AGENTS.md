# AGENTS.md

Guide for AI assistants working on this repository. Read it fully before changing anything.

Commit prefix: [GITHUB.IO]

## 1. Purpose

`drntth.github.io` is the curated professional portfolio of Tóth Dorina Ildikó (software developer, AI and backend), published on GitHub Pages at <https://drntth.github.io/>.

It is a curated portfolio, not an engineering log. Material is reviewed before it is added; only publishable, presentable material belongs in this repository.

## 2. Collaboration preferences

- The owner communicates in Hungarian. Reply in Hungarian unless asked otherwise. Code, identifiers and this file stay in English.
- Style: concise, technical, neutral, structured (headings, lists). No emojis, no filler, no greetings.
- Ask when a task is ambiguous or when a fact is missing. Never invent personal, professional or technical facts. Anything not listed in section 9 or confirmed by the owner is unverified: mark it or ask.
- Do not rewrite whole files when a small diff is enough. Show changed parts and say where they go.

## 2a. Working agreement

Workflow per round: read the relevant files, propose a short plan, wait for approval, implement in small steps, run `npm run build` after each step, report what changed and what to verify.

Ask before:

- changing a content schema (`src/content.config.ts`), routes or URLs, dependencies, build or deploy configuration;
- deleting or renaming files, or removing content;
- changing any fact, name, date, number or claim about the owner or projects (never invent facts; mark unknowns);
- changing licensing, personal data or public wording about processes;
- a change that touches more than one page's layout at once.

Act without asking:

- styling, spacing, responsive and accessibility fixes inside existing design tokens;
- wording edits that keep the meaning, always in both `en` and `hu`;
- bug fixes and refactors inside a single file;
- keeping `AGENTS.md` status and `README.md` in sync with finished work.

Never: commit or push (the owner does it), use `bypassPermissions`, or save session prompts or notes in this repository (it is public).
After finishing a round, update the "To do" list in section 10 (remove finished items, keep only open ones).

## 3. Stack

- Astro 7 (static output, GitHub Pages) with Vite 8. Node 22.12 or newer is required.
- Tailwind CSS v4 through `@tailwindcss/vite`. Design tokens are CSS variables.
- Icons: `astro-icon` with `simple-icons`, `mdi`, `lucide`. No emojis anywhere.
- Fonts: `@fontsource-variable/inter` (body), `@fontsource-variable/space-grotesk` (display), self-hosted.
- Carousel: Embla (autoplay, wheel gestures). Background particles: tsParticles slim (v4). Graph: `d3-force`.
- Content: Astro content collections (JSON, glob loader) in `content/`.
- SEO: `@astrojs/sitemap`, JSON-LD, Open Graph, hreflang.
- Dev scripts: `scripts/favicon.mjs`, `scripts/og.mjs` (use `sharp`).
- Search: MiniSearch (client side, lazy loaded).
- CI: GitHub Actions for deploy (`deploy.yml`) and Lighthouse CI (`lighthouse.yml`, config in `lighthouserc.json`).

## 4. Commands

```bash
npm install
npm run dev          # or: astro dev --background (see Development block at the end)
npm run build        # must pass before every push
npm run preview
npx @lhci/cli autorun     # local Lighthouse run after a build (needs lighthouserc.json; output in .lighthouseci/)
node scripts/favicon.mjs   # regenerate favicons from src/assets/avatar.jpg
node scripts/og.mjs        # regenerate public/og.png
```

Certificate preview from PDF (poppler):

```bash
pdftoppm -png -r 90 -f 1 -l 1 -singlefile public/certs/<name>.pdf public/certs/<name>
```

## 4a. Skills (`.claude/skills/`)

These skills are invoked by the user with `/name` and are not visible to the model. Remind the user when they apply:

- `/add-project`: add a project entry in both languages.
- `/add-cert`: add a certificate (PDF, preview, JSON entry in both languages).
- `/release-check`: quality gate before every commit.
- `/commit-message`: one-line commit message from the diff.

At the end of every round, tell the user to run `/release-check`, then `/commit-message`. Do not commit or push.

Claude configuration: `CLAUDE.md` is a symlink to this file. `.claude/settings.json` holds the shared permissions (build, dev server, `astro sync`; edits to schema, config, `package.json`, this file and `public/cv/` ask first). `CLAUDE.local.md` and `.claude/forbidden-terms.txt` are local and git-ignored; read them if present and never quote them in committed files.

## 5. Repository layout

```text
.claude/                  settings.json (shared permissions), skills/ (add-cert, add-project, release-check)
.github/workflows/        deploy.yml (Pages), lighthouse.yml (Lighthouse CI)
lighthouserc.json         Lighthouse CI pages and thresholds
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
  components/             Background, Carousel, FilterBar, Footer, Header, KnowledgeGraph,
                          KnowledgeModel, LangBanner, MethodBand, ResearchFlow, SearchBox, SearchDialog, TechChip
  components/PageHeader.astro   title, intro, Method card and toolbar (search) for list pages
  components/Metrics.astro      key figures (value + label)
  i18n/utils.ts           getContent, localePath, switchPath, loc
  i18n/stack.ts           stack groups and techOf(id, lang)
  layouts/BaseLayout.astro  head, SEO, JSON-LD, footer, reveal observer
  lib/graph.ts knowledge graph from collections
  lib/search.ts server: builds search index entries (build time)
  lib/search-client.ts client: MiniSearch index loading and querying
  lib/search-ui.ts client: shared combobox/listbox logic
  pages/                  thin wrappers only; hu/ mirrors the English tree
  pages/search/[lang].json.ts static index per language
  pages/method.astro, pages/hu/method.astro        wrappers for the Method page
  styles/global.css       tokens and shared classes
  views/                  real page markup shared by EN and HU
  views/Method.astro      how the work is organized: stages, knowledge model, research approach
  views/Research.astro, views/ResearchDetail.astro   research list and detail pages
  content.config.ts       collection schemas (source of truth for fields)
```

## 6. Architecture rules

### i18n

- English is the default locale without prefix (`/`), Hungarian lives under `/hu/`.
- A page is a view in `src/views/` plus two wrappers: `src/pages/<name>.astro` (`lang="en"`) and `src/pages/hu/<name>.astro` (`lang="hu"`). Dynamic routes use `[slug].astro` in both trees.
- Every user-visible string lives in `content/*.json`, with both `en` and `hu`. Never hardcode text in components (the bilingual 404 page is the only exception).
- Always build links with `localePath(lang, path)`, and switch language with `switchPath`.

### Content model

- Technology ids in `tech`, `concepts`, `implementations[].language` refer to ids in `content/stack.json` or to technology node slugs. Unknown ids fall back to a generic icon.
- No `visibility` field and no planned entries: every project, technology and research entry is a finished, published item. Placeholders for future content are not added.
- `research`: `question`, `requirement`, `method[]`, `findings[]`, `decision`, `limits[]` per language; `asOf` (YYYY-MM) marks when the findings were last checked; `sources[]` are external references. Each entry has a detail page `/research/<slug>`.
- Schemas are defined in `src/content.config.ts`. Change the schema first, then the data, then the views.

**Knowledge model** (Technologies page)

```text
Programming Language --implements--> Technology / Concept --used by--> Project
```

- A technology node describes the general concept. The language entry (`implementations`) describes how it is implemented in one language. The project describes how it uses both. Project-specific implementation must not leak into the general node.
- Research starts from a concrete project requirement, covers only what the project needs, and never reproduces full technology documentation. Flow: requirement, unknown question, required technology, relevant concepts, targeted research, prototype/validation, decision, node or project documentation.
- The graph is generated from the collections (`src/lib/graph.ts`). Node size comes from the number of connections. Do not add manual node lists.

### Styling

- Tokens in `global.css`: `--accent` (purple), `--accent-2` (red), `--bg`, `--surface`, `--fg`, `--muted`, `--line`. Purple and red must stay balanced; use gradients and alternate the two.
- Shared classes: `.card`, `.chip`, `.btn`, `.btn-primary`, `.btn-ghost`, `.icon-btn`, `.section-title`, `.text-gradient`, `.reveal`.
- Dark mode is the `.dark` class on `<html>`. The toggle dispatches `themechange`; `Background.astro` listens to recolor particles.
- Respect `prefers-reduced-motion` (reveal animations, autoplay, particles, graph drag are disabled).
- Background: static gradient glows (`.bg-glows`) plus a faint mouse-reactive particle layer. Keep it subtle.

**Header**: anchor links to Home sections (`#about`, `#stack`, `#certificates`, `#contact`), page links (Projects, Technologies, Research, Method), global search button (Ctrl/Cmd+K), hamburger menu below `xl`, language switch, theme icon toggle. The Contact item points to `#site-footer`; the CV download and contact links live in `Footer`, not in the header.

**SEO**: `BaseLayout` props `title`, `description`, `keywords`, `type`, `noindex`, `jsonLd`. Person JSON-LD is global. `og.png` is 1200x630. The `keywords` meta tag has no ranking effect on Google; title, description, headings, hreflang, sitemap and JSON-LD matter.

**Print**: a `@media print` block at the end of `global.css` styles every page except Home (`BaseLayout` prop `print={false}` sets `data-print="off"` on `<html>`). It forces a light palette, hides header, footer, background, search, filters, graph and `.no-print` elements, and prints external link URLs. Mark new screen-only elements with `.no-print`.

**Language banner**: `LangBanner` (mounted in `BaseLayout`, not on `noindex` pages) suggests the other language when the browser's first supported language (`hu` or `en`) differs from the page language. It never redirects; the dismissal is stored in `localStorage` (`lang-banner-dismissed`). Strings under `langBanner` are written in the suggested language, so `en.json` holds Hungarian text and `hu.json` English text.

**Lighthouse CI**: `.github/workflows/lighthouse.yml` and `lighthouserc.json` run Lighthouse on key pages for pull requests and pushes to `main`. Thresholds are warnings. Results: Actions run, job summary (report links) and the `lighthouse-results` artifact.

**Method page** (`/method`, `/hu/method`)

- Own menu item. The `MethodBand` component links to it from Projects, Technologies and Research.
- Strings live in `content/*.json` under `methodPage`.
- `KnowledgeModel` and `ResearchFlow` are used only here (strings `methodPage.modelLabels`, `modelExample`, `flow`). The Technologies page keeps a one-line model hint plus a link to `/method#knowledge`.
- Blocks: stages (nine, with the readiness check marked as a decision point; the flow is not strictly linear), knowledge model (`KnowledgeModel`), research approach (`ResearchFlow` plus rules), readiness criteria, what gets published.
- Do not describe where material is kept or prepared, any switching between non-public and public, or discarded projects.

### Search

- `src/lib/search.ts` builds the entries at build time from the collections and the `methodPage` strings. `src/pages/search/[lang].json.ts` serves them as `/search/en.json` and `/search/hu.json`. Entry: `{ id, section, type, title, summary, text, tags, url }`; `text` holds the long-form body, so detail-page content is searchable.
- Client: MiniSearch in `src/lib/search-client.ts`, accent-insensitive, prefix and fuzzy matching, loaded on first focus. Shared UI logic: `src/lib/search-ui.ts`.
- Global: header button and Ctrl/Cmd+K open `SearchDialog` (mounted in `BaseLayout`), results grouped by section, section chips filter.
- Section: `SearchBox` with `scope` sits in the `PageHeader` toolbar of the list pages (Projects, Technologies, Research, Method) and is not shown on detail pages. The index still contains the long-form text of the detail pages, so a list-page search finds it.
- Technologies: the scoped search filters the cards and highlights graph nodes through the `search:results` window event. Extra filter: language.
- Only the current language is searched. No external service.
- Accessibility: combobox/listbox roles, arrow keys, Enter, Esc.
- `projects[].en|hu.metrics` (value and label pairs) are key figures shown on the list card and the detail page. Keep them factual and countable; narrative claims go to `highlights`.

## 7. How to extend

| Task                   | Steps                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Add a project          | Use /add-project (skill)                                                                                                                                                                                                                                                                         |
| Add a stack item       | Add `{ id, name, icon }` to a group in `content/stack.json`.                                                                                                                                                                                                                                     |
| Add a technology node  | Create `content/technologies/<slug>.json`. Fill `implementations` per language. Reference it from a project via `concepts`.                                                                                                                                                                      |
| Add research           | Create `content/research/<slug>.json` with all fields and both languages. Link `technologies` and `projects`. Only verified findings; mark unverified claims as such.                                                                                                                            |
| Add a certificate      | Use /add-cert (skill)                                                                                                                                                                                                                                                                            |
| Add a page             | View, two wrappers, header link, `nav` key in both JSON files, check the sitemap.                                                                                                                                                                                                                |
| Add a string           | Add the key to both `en.json` and `hu.json`.                                                                                                                                                                                                                                                     |
| Change colors          | Edit tokens in `global.css` only.                                                                                                                                                                                                                                                                |
| Add searchable content | Entries of `projects`, `technologies`, `research` and the Method strings are indexed automatically. A new section needs a value in `Section` and entries in `buildIndex` (`src/lib/search.ts`), a `SearchBox scope`, and strings under `search.sections`, `search.placeholders`, `search.types`. |

## 8. Content rules (decided with the owner)

- Publish only public, professionally relevant projects. Published now: the BSc thesis, the YAML LaTeX CV Generator, the Static Multisite Generator and this portfolio site.
- Do not publish confidential or employer-related project details. Describe technology areas only, never concrete internal projects, systems, users or results.
- Employer work stays at CV level: employer, department, title, dates, generic technology areas and widely used public tools. Never internal system or product names, internal URLs, architecture or pipeline details, scoring rules, thresholds, model choices per task, prompts, test or benchmark results, hardware, costs, plans, or anything rewritten from work code or documents.
- Technology notes, research and projects come only from own projects. Employer work is never a source for them, not even generalized or rebuilt as a side project.
- Public lifecycle wording: describe stages and criteria, not where the material is kept.
- Do not describe or reference where or how material is prepared, stored or reviewed before publication, in code, content, comments, README or this file.
- Research entries need standalone professional value and are added only after review.
- No percentage or ranking of skills. No radar charts with scores. The knowledge graph shows relationships, not levels.
- Technologies listed must be ones the owner confirmed using. Do not add libraries because they are common.
- Name policy: full name "Tóth Dorina Ildikó" in the hero, footer and CV; short form (`hero.shortName`: "Dorina Tóth" in EN, "Tóth Dorina" in HU) in titles, descriptions, header brand, `og:site_name` and READMEs. JSON-LD `name` is "Dorina Tóth" with the other forms as `alternateName`.
- Title is "Software Developer - AI & Backend" (no "Junior").
- Keep the page short and scannable. Detailed notes belong to Technologies, Research and project detail pages.
- Not published on the site pages: phone number, birth date, address. Exception: the downloadable CV PDFs (`public/cv/`) keep their header with phone number and city, as the owner decided.
- Client work is named only as "individual client" ("egyéni megrendelő"), never by the client's or the client's business name, matching the CV.
- Licensing: code is MIT (`LICENSE`); `content/`, `public/` and `src/assets/` are all rights reserved (`CONTENT_LICENSE.md`). Do not move personal content into code paths.

## 9. Confirmed facts

**Person**: BSc in Software Engineering (Programtervező informatikus), Eszterházy Károly Catholic University, 2022-2025. Technician in computer system maintenance, Váci SZC Petőfi Sándor Technical School, 2018-2022. Languages: Hungarian (native), English (intermediate), German (basic).

**Experience**: Software Developer, Eszterházy Károly Catholic University IT Development Department, 2025-present (AI systems in Python; LLM, RAG, embeddings, prompt engineering, fine-tuning, OCR with Tesseract plus AI vision, document processing, SAT-based constraint optimization; experimenting with agent frameworks). Teaching assistant (C#, agile methods), 2023-2024. Web developer for Kepes György College (also external communication group lead, financial officer and secretary), 2022-2025.

**Thesis project** (`thesis-langmodels-project-management`): title "Mesterséges intelligencia a webalkalmazásokban", subtitle "Nyelvi modellek a projektmenedzsmentben", 2025. Django, Python, SQLite, Bootstrap, JavaScript, Docker, Cypress, Hugging Face pipelines. Models: DistilGPT2, GPT-Neo 125M, Facebook OPT 125M and 350M, GPT-2 Medium. 248 unit tests and 258 Cypress end-to-end tests, all passing. Four permission levels. Markdown export compatible with GitHub. Docker Hub: <https://hub.docker.com/r/drntth/thesis-langmodels-project-management>. No demo and no screenshots: the project uses an icon instead of an image. The thesis PDF is intentionally not published (it contains sensitive data).

**CV generator project** (`yaml-latex-cv-generator`): 2026, public, MIT. Python, Jinja2, LaTeX (latexmk), YAML, pytest. Two languages (en, hu), two CV variants (`developer`, `general`), 8 committed sample PDFs from fictional data (Jane Doe), 32 pytest tests, reproducible PDF builds. Concept: `template-based-document-generation`.

**Static multi-site project** (`static-multisite-generator`): 2026, public, MIT. Python, Jinja2, Pillow, Bootstrap, Apache `.htaccess`, pytest. Three fictional sample sites, 9 page templates, 4 generated files per site (sitemap, robots, llms.txt, .htaccess), 28 pytest tests, self-hosted libraries and fonts. Concepts: `static-site-generation`, `incremental-deploy`, `web-performance`, `technical-seo`, `privacy-friendly-web` (self-hosting only), `template-based-document-generation`.

**Portfolio project** (`drntth-github-io`): this site, 2026 rebuild (first commit 2025-08), public, MIT code. Astro 7, TypeScript, Tailwind CSS v4, GitHub Actions (deploy, Lighthouse CI). Two languages, four content collections, no third-party services. Concepts: `content-collections`, `bilingual-content-model`, `client-side-search`, `knowledge-graph-visualization`, `technical-seo`, `web-performance`.

**Certificates** (all AWS Training and Certification): "AWS Foundations: Machine Learning Basics" and "Fundamentals of Machine Learning and Artificial Intelligence" (completed 2026-09-24), "Fundamentals of Generative AI" (completed 2026-10-04).

**Stack decisions**: languages Python, Java, C#, TypeScript, JavaScript, SQL, PHP. Frontend: React, Astro, Tailwind CSS, Bootstrap. Databases PostgreSQL, MySQL, SQLite, MongoDB. pgvector is a PostgreSQL extension, listed under AI. AI tools: Ollama, Hugging Face Transformers, LangGraph, pgvector, PyTorch, OpenAI API, Anthropic API, Tesseract. Document and site generation: Jinja2, LaTeX, YAML, Pillow, Apache (.htaccess); testing: pytest. Explicitly not claimed: LangChain, LlamaIndex, llama.cpp, ChromaDB, FAISS, Sentence Transformers, scikit-learn.

## 10. Status

To do:

- [ ] Interview 1 (not now): owner rewrites research questions in own words.
- [x] `research/<slug>` detail pages.

## 11. Known pitfalls

- Schema `z` is imported from `astro/zod` (not from `astro:content`). Astro 7 requires Node 22.12+.
- Markdown inside HTML blocks on GitHub needs a blank line after the opening tag (matters for READMEs, not the site).
- GitHub Pages serves only the root `404.html`.
- Icon names (`mdi`, `lucide`, `simple-icons`) change between versions; a wrong name fails the build.
- tsParticles v4 (`@tsparticles/engine`, `@tsparticles/slim`); check the v4 docs before changing `Background.astro`.
- Embla wheel plugin handles horizontal gestures only; vertical page scroll must keep working.
- Do not commit `dist/`, `node_modules/`, `.astro/`.
- The search index is generated at build time; rebuild after content changes.
- The hamburger breakpoint is `xl`; with more header items check the layout around 1280 px.

## Development

When starting the dev server, use background mode:

```text
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: <https://docs.astro.build>

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
