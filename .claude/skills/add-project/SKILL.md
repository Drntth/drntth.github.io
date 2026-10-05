---
name: add-project
description: Add a project entry to the portfolio (content/projects/<slug>.json) in English and Hungarian. Use when the user wants to add, publish or plan a project entry.
disable-model-invocation: true
allowed-tools: Bash(npm run build) Bash(npx astro sync)
---

# Add a project

1. Read `src/content.config.ts` (the schema is the source of truth) and `content/stack.json` (valid technology ids).
2. Ask for every missing fact. Never invent goals, results, numbers, dates or links; facts come only from the user or from files the user points to.
3. Create `content/projects/<slug>.json` (kebab-case slug) with `en` and `hu` blocks of equal structure.
   - `visibility: public` only for finished, presentable projects, otherwise `planned`.
   - `tech` and `concepts` ids must exist in `stack.json` or `content/technologies/`. If not, stop and ask.
   - `metrics` hold countable facts only; narrative claims go to `highlights`.
4. Content rules: no confidential or employer-related details; no reference to private tooling, workspaces or internal processes.
5. Run `npx astro sync` and `npm run build`, then report what to check in the browser.
