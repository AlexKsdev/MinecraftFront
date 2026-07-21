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
