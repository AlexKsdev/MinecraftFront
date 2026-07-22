import { serverFetch } from "@/lib/server/api";
import type { WikiArticleDetail, WikiCategory } from "./types";
import type { PostLocale } from "@/features/blog/types";

/**
 * The wiki is public, so there is no session to carry — `serverFetch` forwards
 * cookies anyway, which costs nothing and keeps one fetch helper rather than two.
 */
export async function fetchWiki(
  locale: PostLocale,
  q?: string,
): Promise<WikiCategory[]> {
  const params = new URLSearchParams({ locale });
  if (q) params.set("q", q);

  const res = await serverFetch(`/wiki?${params.toString()}`);
  // An empty wiki and an unreachable backend should not look the same to a
  // reader, but neither is worth a crash — the page renders its empty state.
  if (!res.ok) return [];
  return (await res.json()) as WikiCategory[];
}

/** Null for anything the backend won't serve, so the page can 404 cleanly. */
export async function fetchWikiArticle(
  slug: string,
  locale: PostLocale,
): Promise<WikiArticleDetail | null> {
  const res = await serverFetch(
    `/wiki/${encodeURIComponent(slug)}?locale=${locale}`,
  );
  if (!res.ok) return null;
  return (await res.json()) as WikiArticleDetail;
}
