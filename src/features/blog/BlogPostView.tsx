import { notFound } from "next/navigation";
import { posts } from "./constants";
import { PostDetail } from "./components/PostDetail";

export function BlogPostView({ slug }: { slug: string }) {
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}
