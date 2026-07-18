import { AdminOrdersView } from "@/features/admin/AdminOrdersView";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  return <AdminOrdersView status={status} page={Number(page) || 1} />;
}
