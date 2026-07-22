export type TagAccent = "primary" | "amber" | "sky" | "purple" | "yellow";

/** Mirrors the backend's Locale enum, lowercased for the route. */
export type PostLocale = "en" | "uk";

export interface PostListItem {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  tag: string;
  tagAccent: TagAccent;
  author: string;
  /** ISO string over the wire; formatted per locale at render time. */
  publishedAt: string;
  readTimeMinutes: number;
  /**
   * The locale actually rendered. Differs from the requested one when only the
   * English copy exists, so a post is shown rather than hidden.
   */
  locale: "EN" | "UK";
}

export interface PostDetail extends PostListItem {
  /** Markdown. */
  body: string;
}
