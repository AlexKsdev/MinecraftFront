import { serverFetch } from "@/lib/server/api";
import type { PostDetail, PostListItem, PostLocale } from "./types";

/**
 * The blog is public, so these run from Server Components with no session to
 * carry — `serverFetch` forwards cookies anyway, which costs nothing here and
 * keeps one fetch helper rather than two.
 */
export async function fetchPosts(locale: PostLocale): Promise<PostListItem[]> {
  const res = await serverFetch(`/posts?locale=${locale}`);
  // An empty blog and an unreachable backend should not look the same to a
  // reader, but neither is worth a crash — the list renders its empty state.
  if (!res.ok) return [];
  return (await res.json()) as PostListItem[];
}

/** Null for anything the backend won't serve, so the page can 404 cleanly. */
export async function fetchPost(
  slug: string,
  locale: PostLocale,
): Promise<PostDetail | null> {
  const res = await serverFetch(
    `/posts/${encodeURIComponent(slug)}?locale=${locale}`,
  );
  if (!res.ok) return null;
  return (await res.json()) as PostDetail;
}
