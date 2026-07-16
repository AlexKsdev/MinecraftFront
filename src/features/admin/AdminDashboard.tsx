import { getTranslations } from "next-intl/server";
import { serverFetch } from "@/lib/server/api";
import styles from "./AdminDashboard.module.scss";

interface RecentPayment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  userId: string;
}

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalProducts: number;
  revenueCents: number;
  recentPayments: RecentPayment[];
}

const STATUS_CLASS: Record<string, string> = {
  SUCCEEDED: styles.statusSucceeded,
  PENDING: styles.statusPending,
  FAILED: styles.statusFailed,
  REFUNDED: styles.statusFailed,
};

/**
 * A Server Component: the stats are fetched during the render that produces the
 * page, so no loading state, no client bundle, and the admin cookie never has
 * to be exercised from the browser. The layout has already established that the
 * caller is an admin.
 */
export async function AdminDashboard() {
  const t = await getTranslations("Admin");
  const res = await serverFetch("/admin/stats");

  if (!res.ok) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.empty}>{t("loadFailed")}</p>
        </div>
      </div>
    );
  }

  const stats = (await res.json()) as AdminStats;
  const cards = [
    { label: t("stats.users"), value: stats.totalUsers.toLocaleString("en-US") },
    { label: t("stats.admins"), value: stats.totalAdmins.toLocaleString("en-US") },
    { label: t("stats.products"), value: stats.totalProducts.toLocaleString("en-US") },
    { label: t("stats.revenue"), value: formatMoney(stats.revenueCents) },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>

        <div className={styles.statsGrid}>
          {cards.map((card) => (
            <div key={card.label} className={styles.statCard}>
              <div className={styles.statValue}>{card.value}</div>
              <div className={styles.statLabel}>{card.label}</div>
            </div>
          ))}
        </div>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t("recentPayments")}</h2>
          {stats.recentPayments.length === 0 ? (
            <p className={styles.empty}>{t("noPayments")}</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("table.date")}</th>
                    <th>{t("table.user")}</th>
                    <th>{t("table.amount")}</th>
                    <th>{t("table.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.createdAt).toLocaleDateString("en-GB")}</td>
                      <td className={styles.mono}>{payment.userId}</td>
                      <td>{formatMoney(payment.amount)}</td>
                      <td>
                        <span
                          className={`${styles.status} ${STATUS_CLASS[payment.status] ?? ""}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/** Amounts are stored in the smallest currency unit. */
function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
