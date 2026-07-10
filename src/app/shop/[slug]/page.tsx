import { ProductView } from "@/features/shop/ProductView";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
