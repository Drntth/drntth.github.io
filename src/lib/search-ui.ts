import { loadIndex, search, type Hit } from "./search-client";
import type { Section } from "./search";

export interface Labels {
  empty: string;
  results: string;
  planned: string;
  sections: Record<string, string>;
  types: Record<string, string>;
}

interface Options {
  lang: string;
  input: HTMLInputElement;
  list: HTMLElement;
  status: HTMLElement;
  labels: Labels;
  scope?: Section | null;
  getScope?: () => Section | null;
  grouped?: boolean;
  emit?: boolean;
  onNavigate?: () => void;
}

const ORDER: Section[] = ["projects", "technologies", "research", "method"];
const clip = (s: string, n = 140) =>
  s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};

export function mountSearch(o: Options) {
  let hits: Hit[] = [];
  let active = -1;
  let timer: number | undefined;
  let token = 0;
  const currentScope = () => (o.getScope ? o.getScope() : (o.scope ?? null));

  const setActive = (i: number) => {
    active = i;
    o.list.querySelectorAll<HTMLElement>("[role=option]").forEach((n, idx) => {
      n.setAttribute("aria-selected", String(idx === i));
      if (idx === i) n.scrollIntoView({ block: "nearest" });
    });
    if (i >= 0)
      o.input.setAttribute("aria-activedescendant", `${o.list.id}-opt-${i}`);
    else o.input.removeAttribute("aria-activedescendant");
  };

  const render = (query: string) => {
    o.list.replaceChildren();
    const open = query.trim().length > 0;
    o.list.hidden = !open;
    o.input.setAttribute("aria-expanded", String(open));
    o.status.textContent = "";
    if (!open) return setActive(-1);
    if (!hits.length) {
      const li = el("li", "search-empty", o.labels.empty);
      li.setAttribute("role", "presentation");
      o.list.appendChild(li);
      o.status.textContent = o.labels.empty;
      return setActive(-1);
    }
    let last = "";
    hits.forEach((h, i) => {
      if (o.grouped && h.section !== last) {
        last = h.section;
        const g = el(
          "li",
          "search-group",
          o.labels.sections[h.section] ?? h.section,
        );
        g.setAttribute("role", "presentation");
        o.list.appendChild(g);
      }
      const li = el("li", "search-hit");
      li.id = `${o.list.id}-opt-${i}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      const a = el("a");
      a.href = h.url;
      const title = el("div", "search-hit-title");
      title.appendChild(el("span", undefined, h.title));
      title.appendChild(el("span", "chip", o.labels.types[h.type] ?? h.type));
      if (h.planned) title.appendChild(el("span", "chip", o.labels.planned));
      a.appendChild(title);
      a.appendChild(el("div", "search-hit-summary", clip(h.summary)));
      a.addEventListener("click", () => o.onNavigate?.());
      li.appendChild(a);
      li.addEventListener("mousemove", () => {
        if (active !== i) setActive(i);
      });
      o.list.appendChild(li);
    });
    o.status.textContent = `${hits.length} ${o.labels.results}`;
    setActive(0);
  };

  const run = async () => {
    const mine = ++token;
    const query = o.input.value;
    const sc = currentScope();
    let found: Hit[] = [];
    try {
      found = await search(o.lang, query, sc);
    } catch {
      found = [];
    }
    if (mine !== token) return;
    hits = o.grouped
      ? ORDER.flatMap((s) => found.filter((h) => h.section === s))
      : found;
    render(query);
    if (o.emit) {
      window.dispatchEvent(
        new CustomEvent("search:results", {
          detail: {
            scope: sc,
            query: query.trim(),
            urls: hits.map((h) => h.url),
          },
        }),
      );
    }
  };

  o.input.addEventListener("focus", () => {
    void loadIndex(o.lang);
    if (o.input.value.trim()) void run();
  });
  o.input.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(run, 90);
  });
  o.input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && hits.length) {
      e.preventDefault();
      setActive((active + 1) % hits.length);
    } else if (e.key === "ArrowUp" && hits.length) {
      e.preventDefault();
      setActive((active - 1 + hits.length) % hits.length);
    } else if (e.key === "Enter" && active >= 0 && hits[active]) {
      e.preventDefault();
      o.onNavigate?.();
      location.href = hits[active].url;
    }
  });

  return {
    run,
    clear() {
      o.input.value = "";
      void run();
    },
  };
}
