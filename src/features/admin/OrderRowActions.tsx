"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PAYMENT_STATUSES,
  updatePaymentStatus,
  type AdminPayment,
  type PaymentStatus,
} from "@/lib/admin/api";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";

/**
 * Changing a payment's status moves money, so it sits behind StepUpGuard;
 * useStepUpAction parks the change and replays it once a code checks out, so the
 * admin sees one prompt rather than an error to recover from.
 */
export function OrderRowActions({ order }: { order: AdminPayment }) {
  const t = useTranslations("Admin");
  const action = useStepUpAction();
  const [status, setStatus] = useState<PaymentStatus>(order.status);

  if (action.awaitingCode) return <StepUpPrompt action={action} />;

  return (
    <div className={styles.actions}>
      <select
        className={styles.filterSelect}
        value={status}
        onChange={(e) => setStatus(e.target.value as PaymentStatus)}
        disabled={action.busy}
        aria-label={t("orders.setStatusLabel")}
      >
        {PAYMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t(`orders.status.${s}`)}
          </option>
        ))}
      </select>
      <button
        className={styles.actionBtn}
        type="button"
        disabled={action.busy || status === order.status}
        onClick={() => void action.run(() => updatePaymentStatus(order.id, status))}
      >
        {t("orders.apply")}
      </button>
      {action.error && <span className={styles.rowError}>{action.error}</span>}
    </div>
  );
}
