import { readFileSync } from "node:fs";

// Arrays are leaves; their length is part of the key, so unequal lengths show up as mismatches.
const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    Array.isArray(v)
      ? [`${p}${k}#${v.length}`]
      : v && typeof v === "object"
        ? flat(v, `${p}${k}.`)
        : [`${p}${k}`],
  );
const load = (f) => new Set(flat(JSON.parse(readFileSync(f, "utf8"))));
const en = load("content/en.json");
const hu = load("content/hu.json");
const onlyEn = [...en].filter((k) => !hu.has(k));
const onlyHu = [...hu].filter((k) => !en.has(k));
console.log(JSON.stringify({ onlyEn, onlyHu }, null, 2));
process.exit(onlyEn.length || onlyHu.length ? 1 : 0);
