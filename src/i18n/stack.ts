import stack from "../../content/stack.json";
import { loc, type L10n, type Lang } from "./utils";

type Item = { id: string; name: L10n; icon: string };
export const groups = stack.groups as {
  id: string;
  name: L10n;
  items: Item[];
}[];
export const stackById: Record<string, Item> = Object.fromEntries(
  groups.flatMap((g) => g.items.map((i) => [i.id, i])),
);
export const techOf = (id: string, lang: Lang) => {
  const i = stackById[id];
  return {
    id,
    name: i ? loc(i.name, lang) : id,
    icon: i?.icon ?? "lucide:circle-dot",
  };
};
