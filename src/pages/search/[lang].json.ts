import type { APIRoute, GetStaticPaths } from "astro";
import { buildIndex } from "../../lib/search";
import type { Lang } from "../../i18n/utils";

export const getStaticPaths: GetStaticPaths = () => [
  { params: { lang: "en" } },
  { params: { lang: "hu" } },
];

export const GET: APIRoute = async ({ params }) => {
  const entries = await buildIndex(params.lang as Lang);
  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json" },
  });
};
