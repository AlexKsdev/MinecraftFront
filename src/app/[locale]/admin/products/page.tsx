import { AdminProductsView } from "@/features/admin/AdminProductsView";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  return <AdminProductsView page={Number(page) || 1} />;
}
