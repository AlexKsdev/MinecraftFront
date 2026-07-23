import { WikiArticleView } from "@/features/wiki/WikiArticleView";

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <WikiArticleView slug={slug} />;
}
