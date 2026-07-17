"use client";

import { useTranslations } from "next-intl";
import {
  adjustBalance,
  changeRole,
  deleteUser,
  type AdminUser,
} from "@/lib/admin/api";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";

/**
 * Role, balance and delete all sit behind StepUpGuard; useStepUpAction parks the
 * action and replays it once a code checks out, so the admin sees one prompt
 * rather than an error to recover from.
 */
export function UserRowActions({ user }: { user: AdminUser }) {
  const t = useTranslations("Admin");
  const action = useStepUpAction();

  if (action.awaitingCode) return <StepUpPrompt action={action} />;

  const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  return (
    <div className={styles.actions}>
      <button
        className={styles.actionBtn}
        type="button"
        disabled={action.busy}
        onClick={() => void action.run(() => changeRole(user.id, nextRole))}
      >
        {nextRole === "ADMIN" ? t("users.promote") : t("users.demote")}
      </button>
      <button
        className={styles.actionBtn}
        type="button"
        disabled={action.busy}
        onClick={() => void action.run(() => adjustBalance(user.id, { coins: 100 }))}
      >
        {t("users.giveCoins", { count: 100 })}
      </button>
      <button
        className={`${styles.actionBtn} ${styles.actionDanger}`}
        type="button"
        disabled={action.busy}
        onClick={() => {
          if (confirm(t("users.confirmDelete", { name: user.name }))) {
            void action.run(() => deleteUser(user.id));
          }
        }}
      >
        {t("users.delete")}
      </button>
      {action.error && <span className={styles.rowError}>{action.error}</span>}
    </div>
  );
}
