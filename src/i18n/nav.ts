import { getContent, localePath, type Lang } from "./utils";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  page?: string;
}

export function navItems(lang: Lang): NavItem[] {
  const c = getContent(lang);
  const home = localePath(lang, "/");
  return [
    { id: "about", href: `${home}#about`, label: c.nav.about },
    { id: "stack", href: `${home}#stack`, label: c.nav.stack },
    {
      id: "certificates",
      href: `${home}#certificates`,
      label: c.nav.certificates,
    },
    {
      id: "projects",
      href: localePath(lang, "/projects"),
      label: c.nav.projects,
      page: "/projects",
    },
    {
      id: "technologies",
      href: localePath(lang, "/technologies"),
      label: c.nav.technologies,
      page: "/technologies",
    },
    {
      id: "research",
      href: localePath(lang, "/research"),
      label: c.nav.research,
      page: "/research",
    },
    {
      id: "method",
      href: localePath(lang, "/method"),
      label: c.nav.method,
      page: "/method",
    },
    { id: "contact", href: "#site-footer", label: c.nav.contact },
  ];
}

export const barePath = (pathname: string) =>
  pathname.replace(/^\/hu(?=\/|$)/, "") || "/";

export const isCurrent = (pathname: string, item: NavItem) =>
  !!item.page && barePath(pathname).startsWith(item.page);
