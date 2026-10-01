import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://drntth.github.io",
  build: { format: "directory" },
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes("/404"),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", hu: "hu" },
      },
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu"],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
