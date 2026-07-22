import {
  BookMarked,
  HelpCircle,
  Home,
  Map,
  Pickaxe,
  Settings,
  Shield,
  Swords,
  Users,
  Zap,
} from "lucide-react";

/**
 * Mirrors WIKI_ICONS in the backend's config/wiki.config.ts. Categories store
 * an icon by name; this maps each to its component.
 */
export const WIKI_ICON_MAP: Record<
  string,
  (typeof Home) | undefined
> = {
  Home,
  Pickaxe,
  Swords,
  Shield,
  Users,
  Zap,
  BookMarked,
  Map,
  Settings,
  HelpCircle,
};

/** Used when a stored name has no mapping, so a card never renders iconless. */
export const WIKI_FALLBACK_ICON = BookMarked;
