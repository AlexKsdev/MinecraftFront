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
 * The languages a post can be written in, in the order the form shows them.
 *
 * Lives here rather than in `lib/admin/api.ts` because that module is
 * `"use client"`: a Server Component importing a *value* from it gets a client
 * reference, not the array. Types are erased, so TypeScript and the build both
 * pass and it only fails when the page actually renders.
 */
export const POST_LOCALES = ["EN", "UK"] as const;

export type PostLocale = (typeof POST_LOCALES)[number];
