import { AdminUsersView } from "@/features/admin/AdminUsersView";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  return <AdminUsersView search={search} page={Number(page) || 1} />;
}
