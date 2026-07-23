import { WikiListView } from "@/features/wiki/WikiListView";

export default async function WikiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <WikiListView q={q} />;
}
