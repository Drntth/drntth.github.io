# drntth.github.io

Curated professional portfolio of Dorina Tóth (Software Developer, AI & Backend), in English and Hungarian.

Live site: https://drntth.github.io/

## Stack

Astro, Tailwind CSS v4, Astro content collections (JSON), `astro-icon`, Embla Carousel, tsParticles, d3-force. Deployed to GitHub Pages with GitHub Actions.

## Pages

| Route                                   | Content                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `/`, `/hu/`                             | Hero, focus areas, selected projects, about, stack, certificates, contact |
| `/projects`, `/projects/<slug>`         | Published projects and project detail pages                               |
| `/technologies`, `/technologies/<slug>` | Technology knowledge map and technology nodes                             |
| `/research`                             | Selected research (planned structure)                                     |

## Local development

```bash
npm install
npm run dev
npm run build
```

Node 22 or newer is recommended.

## Editing content

All text and data live in `content/`. Components contain no hardcoded text. Every string exists in English and Hungarian. See `AGENTS.md` for the content model, the rules and how to add projects, technology nodes, research entries and certificates.

## Deployment

Every push to `main` builds and deploys the site through `.github/workflows/deploy.yml`. In the repository settings, Pages source must be set to GitHub Actions.

## Assets

```bash
node scripts/favicon.mjs   # favicons from src/assets/avatar.jpg
node scripts/og.mjs        # public/og.png (Open Graph image)
```

## License

Source code: MIT, see `LICENSE`. Texts, images, CVs, certificates and photographs are not covered by it, see `CONTENT_LICENSE.md`.
