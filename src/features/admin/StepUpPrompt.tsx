"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import type { StepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";

/**
 * Replaces a row's controls while a factor is owed. Shared by the user and
 * product tables so the prompt reads the same wherever the guard fires.
 */
export function StepUpPrompt({ action }: { action: StepUpAction }) {
  const t = useTranslations("Admin");

  return (
    <form
      className={styles.stepUp}
      onSubmit={(e) => {
        e.preventDefault();
        void action.confirm();
      }}
    >
      <ShieldCheck size={13} className={styles.stepUpIcon} />
      <input
        className={styles.stepUpInput}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        value={action.code}
        onChange={(e) => action.setCode(e.target.value.replace(/\D/g, ""))}
        placeholder={t("users.stepUpPlaceholder")}
        aria-label={t("users.stepUpLabel")}
      />
      <button
        className={styles.actionBtn}
        type="submit"
        disabled={action.busy || action.code.length !== 6}
      >
        {t("users.stepUpConfirm")}
      </button>
      <button className={styles.linkBtn} type="button" onClick={action.cancel}>
        {t("users.cancel")}
      </button>
      {action.error && <span className={styles.rowError}>{action.error}</span>}
    </form>
  );
}
