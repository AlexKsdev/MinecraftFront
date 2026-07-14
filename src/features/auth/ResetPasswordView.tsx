"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Lock, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/auth/api";
import formStyles from "@/components/AuthModal/AuthForm.module.scss";
import styles from "./ResetPasswordView.module.scss";

export function ResetPasswordView() {
  const t = useTranslations("Auth");
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError(t("reset.missingToken"));
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      await resetPassword(token, password);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === "done" ? (
          <>
            <span className={styles.icon}>
              <CheckCircle2 size={40} />
            </span>
            <h1 className={styles.title}>{t("reset.doneTitle")}</h1>
            <p className={styles.text}>{t("reset.doneText")}</p>
            <Link href="/" className={styles.primaryBtn}>
              {t("reset.backHome")}
            </Link>
          </>
        ) : (
          <>
            <h1 className={styles.title}>{t("reset.title")}</h1>
            {!token && (
              <p className={formStyles.formError}>{t("reset.noTokenNotice")}</p>
            )}
            <form
              className={formStyles.form}
              onSubmit={(e) => void onSubmit(e)}
              noValidate
            >
              {error && <p className={formStyles.formError}>{error}</p>}
              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="new-password">
                  {t("reset.newPassword")}
                </label>
                <div className={formStyles.inputWrap}>
                  <Lock size={15} className={formStyles.inputIcon} />
                  <input
                    className={formStyles.input}
                    id="new-password"
                    type="password"
                    placeholder={t("reset.newPasswordPlaceholder")}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                className={formStyles.submit}
                type="submit"
                disabled={status === "submitting" || !token}
              >
                {status === "submitting" ? t("reset.submitting") : t("reset.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
