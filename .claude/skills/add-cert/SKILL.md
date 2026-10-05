---
name: add-cert
description: Add a certificate to the portfolio (PDF, PNG preview and content/certificates/<slug>.json) in English and Hungarian. Use when the user wants to add a certificate or course completion.
disable-model-invocation: true
allowed-tools: Bash(pdftoppm *) Bash(ls *) Bash(cp *) Bash(npx astro sync) Bash(npm run build)
---

# Add a certificate

## Inputs (ask for every missing one, never invent)

- Exact certificate title (as printed on the certificate).
- Issuer (e.g. "AWS Training and Certification").
- Completion date, `YYYY-MM-DD`.
- Path of the PDF the user provides.
- Course description and objectives (pasted by the user). All text is derived only from this.
- Optional: public verification URL (`verifyUrl`, must be a valid URL).

## Files and naming

- Slug: kebab-case, issuer prefix plus short topic, e.g. `aws-ml-basics`, `aws-ml-ai-fundamentals`. The same slug names all three files:
  - `public/certs/<slug>.pdf` (copy the user's PDF here, do not rename the original)
  - `public/certs/<slug>.png` (preview, generated)
  - `content/certificates/<slug>.json`
- Preview: `pdftoppm -png -r 90 -f 1 -l 1 -singlefile public/certs/<slug>.pdf public/certs/<slug>`
- Check the PDF for sensitive data (address, birth date, phone number) before copying; if present, stop and ask.

## Entry (`content/certificates/<slug>.json`)

Schema source of truth: `src/content.config.ts` (`certificates`). Fields:

- `order`: next free integer (highest existing `order` + 1). Home sorts ascending.
- `issuer`, `date`, `file` (`/certs/<slug>.pdf`), `preview` (`/certs/<slug>.png`), optional `verifyUrl`.
- `en` and `hu`, each with `title`, `summary`, `topics[]`, equal structure.
  - `title`: the official English title in both languages (existing entries do not translate it).
  - `summary`: 1 to 2 sentences, concise, rewritten from the description. Drop boilerplate (accessibility notices, "sessions delivered by an expert instructor", contact info).
  - `topics`: 3 to 6 short items, taken from the description or objectives only.
  - `hu` is a faithful translation, not extra claims.

## Rules

- Do not claim skills the description does not state. No percentages or levels.
- Do not mention where the certificate files are stored or prepared.
- No new strings are needed in `content/en.json` or `hu.json`; the Home section reads the collection.

## Finish

1. Run `npx astro sync` and `npm run build`.
2. Report what to check: Home `#certificates` in EN and HU (card, preview image, PDF link, date).
3. Update `AGENTS.md` section 9 "Certificates" with the new title and date only if the user confirmed them.
4. Remind the user to run `/release-check`, then `/commit-message`. Do not commit or push.
