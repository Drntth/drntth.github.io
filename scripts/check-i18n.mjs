// Checks that content/en.json and content/hu.json have the same key structure.
// Collection entries (projects, research, ...) are checked by the zod schemas at build time.
import { readFileSync } from "node:fs";

const load = (lang) => JSON.parse(readFileSync(`content/${lang}.json`, "utf8"));

function paths(value, prefix = "") {
  if (Array.isArray(value)) {
    return [`${prefix}[${value.length}]`, ...value.flatMap((v, i) => paths(v, `${prefix}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => [
      prefix + k,
      ...paths(v, `${prefix}${k}.`),
    ]);
  }
  return [];
}

const en = new Set(paths(load("en")));
const hu = new Set(paths(load("hu")));
const enOnly = [...en].filter((p) => !hu.has(p));
const huOnly = [...hu].filter((p) => !en.has(p));

for (const p of enOnly) console.error(`only in en.json: ${p}`);
for (const p of huOnly) console.error(`only in hu.json: ${p}`);
if (enOnly.length || huOnly.length) process.exit(1);
console.log(`en.json and hu.json match (${en.size} keys).`);
