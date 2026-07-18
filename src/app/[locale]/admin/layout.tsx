import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/server/api";
import { AdminSidebar } from "@/features/admin/AdminSidebar";
import styles from "@/features/admin/AdminSidebar.module.scss";

/**
 * Gates the whole /admin route group on the server, so the shell is never sent
 * to anyone who isn't an admin.
 *
 * The role comes from /users/me — i.e. the backend's database — not from the
 * readable `pc_user` cookie, which is display-only and tamperable by design.
 * Answering 404 rather than redirecting keeps the panel's existence quiet.
 *
 * This is the second lock, not the only one: every admin endpoint is guarded by
 * AdminGuard, which is the real boundary.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await serverFetch("/users/me");
  if (!res.ok) notFound();

  const me = (await res.json()) as { role?: string };
  if (me.role !== "ADMIN") notFound();

  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
