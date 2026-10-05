---
name: release-check
description: Pre-commit quality gate for the portfolio site. Runs the build and checks forbidden terms, en/hu key parity, the name policy, layout rules, search index and sitemap. Use before the user commits.
disable-model-invocation: true
allowed-tools: Bash(npm run build) Bash(node .claude/skills/release-check/check-i18n.mjs) Bash(grep *) Bash(git status *)
---

# Release check

Report only. Do not fix anything without asking.

1. Run `npm run build`. Report errors and warnings.
2. Forbidden terms: `grep -rniE "private|workspace|nexus|foundry" content src README.md AGENTS.md`. Sentences in AGENTS.md that describe the prohibition itself are allowed; every other hit is a finding.
3. i18n parity: `node .claude/skills/release-check/check-i18n.mjs` (content/en.json against content/hu.json).
4. Name policy: page titles and `og:site_name` use `hero.shortName`; the hero heading and the footer use `hero.name`. Grep `hero.name` in src/views and src/components.
5. Layout rules: no `max-w-*` on text blocks in src/views, no `!` utility overrides, multi-line text not left-aligned.
6. Output: `dist/search/en.json` and `dist/search/hu.json` exist, the sitemap does not contain `/404`.
7. Output a Markdown checklist: one line per item, pass or fail, with `file:line` for failures.
