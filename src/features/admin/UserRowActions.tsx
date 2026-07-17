"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ShieldCheck } from "lucide-react";
import {
  adjustBalance,
  changeRole,
  deleteUser,
  StepUpRequiredError,
  type AdminUser,
} from "@/lib/admin/api";
import { stepUp } from "@/lib/auth/api";
import { useErrorText } from "@/lib/auth/errors";
import styles from "./AdminUsers.module.scss";

/**
 * Role, balance and delete all sit behind StepUpGuard, so any of them can come
 * back asking for a factor. Rather than surfacing that as a failure, the action
 * is held and replayed once the code checks out — the admin sees one prompt,
 * not an error they have to recover from by hand.
 */
export function UserRowActions({ user }: { user: AdminUser }) {
  const t = useTranslations("Admin");
  const errorText = useErrorText();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<(() => Promise<void>) | null>(null);
  const [code, setCode] = useState("");

  /** Runs an action, and parks it for replay if the server wants a step-up. */
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      router.refresh();
    } catch (err) {
      if (err instanceof StepUpRequiredError) {
        setPending(() => action);
      } else {
        setError(errorText(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function confirmStepUp(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      await stepUp({ code });
      await pending();
      setPending(null);
      setCode("");
      router.refresh();
    } catch (err) {
      setCode("");
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  if (pending) {
    return (
      <form className={styles.stepUp} onSubmit={(e) => void confirmStepUp(e)}>
        <ShieldCheck size={13} className={styles.stepUpIcon} />
        <input
          className={styles.stepUpInput}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder={t("users.stepUpPlaceholder")}
          aria-label={t("users.stepUpLabel")}
        />
        <button
          className={styles.actionBtn}
          type="submit"
          disabled={busy || code.length !== 6}
        >
          {t("users.stepUpConfirm")}
        </button>
        <button
          className={styles.linkBtn}
          type="button"
          onClick={() => {
            setPending(null);
            setCode("");
            setError(null);
          }}
        >
          {t("users.cancel")}
        </button>
        {error && <span className={styles.rowError}>{error}</span>}
      </form>
    );
  }

  const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  return (
    <div className={styles.actions}>
      <button
        className={styles.actionBtn}
        type="button"
        disabled={busy}
        onClick={() => void run(() => changeRole(user.id, nextRole))}
      >
        {nextRole === "ADMIN" ? t("users.promote") : t("users.demote")}
      </button>
      <button
        className={styles.actionBtn}
        type="button"
        disabled={busy}
        onClick={() => void run(() => adjustBalance(user.id, { coins: 100 }))}
      >
        {t("users.giveCoins", { count: 100 })}
      </button>
      <button
        className={`${styles.actionBtn} ${styles.actionDanger}`}
        type="button"
        disabled={busy}
        onClick={() => {
          if (confirm(t("users.confirmDelete", { name: user.name }))) {
            void run(() => deleteUser(user.id));
          }
        }}
      >
        {t("users.delete")}
      </button>
      {error && <span className={styles.rowError}>{error}</span>}
    </div>
  );
}
