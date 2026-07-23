/** A single primary-navigation entry (resolved href + localized label). */
export interface NavLink {
  href: string;
  label: string;
  /** Stay active on nested routes (e.g. /admin/*), not only an exact match. */
  matchPrefix?: boolean;
}

/** Whether a nav link should read as active for the current path. */
export function isNavLinkActive(pathname: string, link: NavLink): boolean {
  return link.matchPrefix
    ? pathname === link.href || pathname.startsWith(`${link.href}/`)
    : pathname === link.href;
}

export interface MobileNavProps {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
  onJoinClick: () => void;
}
