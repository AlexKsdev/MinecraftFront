import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serverFetch } from "@/lib/server/api";
import type { PaginatedUsers } from "@/lib/admin/api";
import { UserRowActions } from "./UserRowActions";
import { UserSearch } from "./UserSearch";
import styles from "./AdminUsers.module.scss";

const PAGE_SIZE = 20;

/**
 * A Server Component: search and paging travel through the URL, so each view is
 * a fresh server render with no client-side fetching or loading state. Only the
 * per-row actions need to be interactive.
 */
export async function AdminUsersView({
  search,
  page,
}: {
  search?: string;
  page: number;
}) {
  const t = await getTranslations("Admin");
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    ...(search ? { search } : {}),
  });
  const res = await serverFetch(`/users?${query.toString()}`);

  if (!res.ok) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.empty}>{t("loadFailed")}</p>
        </div>
      </div>
    );
  }

  const data = (await res.json()) as PaginatedUsers;
  const lastPage = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("users.title")}</h1>
        <p className={styles.subtitle}>
          {t("users.count", { count: data.total })}
        </p>

        <UserSearch initial={search ?? ""} />

        {data.items.length === 0 ? (
          <p className={styles.empty}>{t("users.none")}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("users.table.name")}</th>
                  <th>{t("users.table.email")}</th>
                  <th>{t("users.table.role")}</th>
                  <th>{t("users.table.balance")}</th>
                  <th className={styles.actionsCol}>
                    {t("users.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td className={styles.mono}>{user.email}</td>
                    <td>
                      <span
                        className={`${styles.role} ${
                          user.role === "ADMIN" ? styles.roleAdmin : ""
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className={styles.mono}>
                      {user.coins.toLocaleString("en-US")} / {user.gems}
                    </td>
                    <td>
                      <UserRowActions user={user} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <nav className={styles.pager} aria-label={t("users.pagination")}>
            <PagerLink
              page={page - 1}
              search={search}
              disabled={page <= 1}
              label={t("users.prev")}
            />
            <span className={styles.pagerState}>
              {t("users.pageOf", { page, total: lastPage })}
            </span>
            <PagerLink
              page={page + 1}
              search={search}
              disabled={page >= lastPage}
              label={t("users.next")}
            />
          </nav>
        )}
      </div>
    </div>
  );
}

function PagerLink({
  page,
  search,
  disabled,
  label,
}: {
  page: number;
  search?: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className={`${styles.pagerBtn} ${styles.pagerBtnOff}`}>{label}</span>
    );
  }
  const query = new URLSearchParams({
    page: String(page),
    ...(search ? { search } : {}),
  });
  return (
    <Link className={styles.pagerBtn} href={`/admin/users?${query.toString()}`}>
      {label}
    </Link>
  );
}
