import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serverFetch } from "@/lib/server/api";
import type { PaginatedPayments } from "@/lib/admin/api";
import { OrderRowActions } from "./OrderRowActions";
import { OrderStatusFilter } from "./OrderStatusFilter";
import styles from "./AdminUsers.module.scss";

const PAGE_SIZE = 20;

const STATUS_CLASS: Record<string, string> = {
  SUCCEEDED: styles.statusSucceeded,
  PENDING: styles.statusPending,
  FAILED: styles.statusFailed,
  REFUNDED: styles.statusRefunded,
};

/**
 * A Server Component, like the users and products views: the status filter and
 * paging travel through the URL, so each view is a fresh server render. Only the
 * per-row status change needs to be interactive.
 */
export async function AdminOrdersView({
  status,
  page,
}: {
  status?: string;
  page: number;
}) {
  const t = await getTranslations("Admin");
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    ...(status ? { status } : {}),
  });
  const res = await serverFetch(`/payments/admin?${query.toString()}`);

  if (!res.ok) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.empty}>{t("loadFailed")}</p>
        </div>
      </div>
    );
  }

  const data = (await res.json()) as PaginatedPayments;
  const lastPage = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("orders.title")}</h1>
        <p className={styles.subtitle}>
          {t("orders.count", { count: data.total })}
        </p>

        <OrderStatusFilter initial={status ?? ""} />

        {data.items.length === 0 ? (
          <p className={styles.empty}>{t("orders.none")}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("orders.table.date")}</th>
                  <th>{t("orders.table.buyer")}</th>
                  <th>{t("orders.table.amount")}</th>
                  <th>{t("orders.table.gems")}</th>
                  <th>{t("orders.table.status")}</th>
                  <th className={styles.actionsCol}>{t("orders.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((order) => (
                  <tr key={order.id}>
                    <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                    <td>
                      <div>{order.user.name}</div>
                      <div className={styles.mono}>{order.user.email}</div>
                    </td>
                    <td>{formatMoney(order.amount)}</td>
                    <td className={styles.mono}>{order.gems.toLocaleString("en-US")}</td>
                    <td>
                      <span
                        className={`${styles.status} ${STATUS_CLASS[order.status] ?? ""}`}
                      >
                        {t(`orders.status.${order.status}`)}
                      </span>
                    </td>
                    <td>
                      <OrderRowActions order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <nav className={styles.pager} aria-label={t("orders.pagination")}>
            <PagerLink
              page={page - 1}
              status={status}
              disabled={page <= 1}
              label={t("orders.prev")}
            />
            <span className={styles.pagerState}>
              {t("orders.pageOf", { page, total: lastPage })}
            </span>
            <PagerLink
              page={page + 1}
              status={status}
              disabled={page >= lastPage}
              label={t("orders.next")}
            />
          </nav>
        )}
      </div>
    </div>
  );
}

function PagerLink({
  page,
  status,
  disabled,
  label,
}: {
  page: number;
  status?: string;
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
    ...(status ? { status } : {}),
  });
  return (
    <Link className={styles.pagerBtn} href={`/admin/orders?${query.toString()}`}>
      {label}
    </Link>
  );
}

/** Amounts are stored in the smallest currency unit. */
function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
