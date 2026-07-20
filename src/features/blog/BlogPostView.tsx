import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { fetchPost } from "./api";
import { PostDetail } from "./components/PostDetail";
import type { PostLocale } from "./types";

export async function BlogPostView({ slug }: { slug: string }) {
  const locale = (await getLocale()) as PostLocale;
  const post = await fetchPost(slug, locale);

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}
