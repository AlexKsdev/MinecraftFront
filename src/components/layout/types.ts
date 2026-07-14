/** A single primary-navigation entry (resolved href + localized label). */
export interface NavLink {
  href: string;
  label: string;
}

export interface MobileNavProps {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
  onJoinClick: () => void;
}
