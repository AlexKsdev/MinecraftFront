/**
 * Mirrors POST_TAG_ACCENTS in the backend's config/blog.config.ts — the server
 * rejects anything outside this list, so the form offers exactly it.
 */
export const POST_TAG_ACCENTS = [
  "primary",
  "amber",
  "sky",
  "purple",
  "yellow",
] as const;

/**
 * The languages authored content can be written in, in the order the forms show
 * them. Shared by the blog and the wiki — both store translations per locale.
 *
 * Lives here rather than in `lib/admin/api.ts` because that module is
 * `"use client"`: a Server Component importing a *value* from it gets a client
 * reference, not the array. Types are erased, so TypeScript and the build both
 * pass and it only fails when the page actually renders.
 */
export const CONTENT_LOCALES = ["EN", "UK"] as const;

export type ContentLocale = (typeof CONTENT_LOCALES)[number];

/**
 * Mirrors WIKI_ICONS in the backend's config/wiki.config.ts. A category stores
 * its icon by name; the public wiki maps each to a component.
 */
export const WIKI_ICONS = [
  "Home",
  "Pickaxe",
  "Swords",
  "Shield",
  "Users",
  "Zap",
  "BookMarked",
  "Map",
  "Settings",
  "HelpCircle",
] as const;

/** Mirrors WIKI_ACCENTS in the backend's config/wiki.config.ts. */
export const WIKI_ACCENTS = [
  "primary",
  "amber",
  "red",
  "sky",
  "purple",
  "yellow",
] as const;
