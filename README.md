# drntth.github.io

Curated professional portfolio of Dorina Tóth (Software Developer, AI & Backend), in English and Hungarian.

Live site: <https://drntth.github.io/>

## Stack

Astro, Tailwind CSS v4, Astro content collections (JSON), `astro-icon`, Embla Carousel, tsParticles, d3-force, MiniSearch. Deployed to GitHub Pages with GitHub Actions; Lighthouse CI checks quality on pull requests and pushes.

## Pages

| Route                                   | Content                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `/`, `/hu/`                             | Hero, focus areas, selected projects, about, stack, certificates, contact |
| `/projects`, `/projects/<slug>`         | Published projects and project detail pages                               |
| `/technologies`, `/technologies/<slug>` | Technology knowledge map and technology nodes                             |
| `/research`, `/research/<slug>`         | Selected research notes and research detail pages                         |
| `/method`                               | How the work is organized: stages, knowledge model, research approach     |

Every page exists in English and Hungarian (`/hu/...`). Search is available globally (header, Ctrl/Cmd+K) and within Projects, Technologies, Research and Method. All pages except Home have a print stylesheet. A small banner suggests the other language when the browser language differs; it never redirects.

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```

Node 22.12 or newer is required.

## Editing content

All text and data live in `content/`. Components contain no hardcoded text. Every string exists in English and Hungarian. See `AGENTS.md` for the content model, the rules and how to add projects, technology nodes, research entries and certificates.

## Deployment

Every push to `main` builds and deploys the site through `.github/workflows/deploy.yml`. In the repository settings, Pages source must be set to GitHub Actions.

Lighthouse CI (`.github/workflows/lighthouse.yml`, config in `lighthouserc.json`) runs on pull requests and pushes to `main`. Reports are linked in the job summary of the Actions run and stored as the `lighthouse-results` artifact. Score thresholds are warnings. Locally: `npm run build`, then `npx @lhci/cli autorun`.

## Assets

```bash
node scripts/favicon.mjs   # favicons from src/assets/avatar.jpg
node scripts/og.mjs        # public/og.png (Open Graph image)
```

## License

Source code: MIT, see `LICENSE`. Texts, images, CVs, certificates and photographs are not covered by it, see `CONTENT_LICENSE.md`.
