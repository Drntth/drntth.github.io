---
name: add-project
description: Add a project entry to the portfolio (content/projects/<slug>.json) in English and Hungarian. Use when the user wants to add or publish a finished project entry.
disable-model-invocation: true
allowed-tools: Bash(npm run build) Bash(npx astro sync)
---

# Add a project

1. Read `src/content.config.ts` (the schema is the source of truth) and `content/stack.json` (valid technology ids).
2. Ask for every missing fact. Never invent goals, results, numbers, dates or links; facts come only from the user or from files the user points to.
3. Create `content/projects/<slug>.json` (kebab-case slug) with `en` and `hu` blocks of equal structure.
   - Only finished, presentable projects are added; there are no planned entries.
   - `tech` ids must exist in `stack.json`, `concepts` ids in `content/technologies/`. If not, stop and ask.
   - If related research exists, link it from `content/research/<slug>.json` (`projects`), not from the project.
   - `metrics` hold countable facts only; narrative claims go to `highlights`.
4. Content rules: no confidential or employer-related details; no reference to unpublished tooling or internal processes.
5. Run `npx astro sync` and `npm run build`, then report what to check in the browser.
