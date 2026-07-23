"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { PAYMENT_STATUSES } from "@/lib/admin/api";
import styles from "./AdminUsers.module.scss";

/**
 * Puts the chosen status in the URL and lets the server re-render the list. The
 * filtered view stays linkable and survives a reload, with no client fetching.
 */
export function OrderStatusFilter({ initial }: { initial: string }) {
  const t = useTranslations("Admin");
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    // Back to page 1: the old page number rarely exists under a new filter.
    router.push(value ? `/admin/orders?status=${value}` : "/admin/orders");
  }

  return (
    <div className={styles.searchRow}>
      <select
        className={styles.filterSelect}
        value={initial}
        onChange={onChange}
        aria-label={t("orders.filterLabel")}
      >
        <option value="">{t("orders.allStatuses")}</option>
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t(`orders.status.${s}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
