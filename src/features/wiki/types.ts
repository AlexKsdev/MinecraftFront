export type CategoryAccent =
  | "primary"
  | "amber"
  | "red"
  | "sky"
  | "purple"
  | "yellow";

export interface WikiArticleListItem {
  slug: string;
  title: string;
  summary: string;
  /** The locale actually rendered — EN when the requested one isn't written. */
  locale: "EN" | "UK";
}

export interface WikiCategory {
  key: string;
  title: string;
  /** Name from the server's allowlist; mapped to a component by WIKI_ICON_MAP. */
  icon: string;
  accent: CategoryAccent;
  locale: "EN" | "UK";
  articles: WikiArticleListItem[];
}

export interface WikiArticleDetail extends WikiArticleListItem {
  /** Markdown. */
  body: string;
  categoryKey: string;
  categoryTitle: string;
}
