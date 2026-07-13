"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/auth/api";
import formStyles from "@/components/AuthModal/AuthForm.module.scss";
import styles from "./ResetPasswordView.module.scss";

export function ResetPasswordView() {
  const token = useSearchParams().get("token");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("This reset link is missing its token.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      await resetPassword(token, password);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            <h1 className={styles.title}>Password updated</h1>
            <p className={styles.text}>
              Your password has been reset. You can now sign in with your new
              password.
            </p>
            <Link href="/" className={styles.primaryBtn}>
              Back to home
            </Link>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Reset your password</h1>
            {!token && (
              <p className={formStyles.formError}>
                This link is missing a reset token. Please use the link from
                your email.
              </p>
            )}
            <form
              className={formStyles.form}
              onSubmit={(e) => void onSubmit(e)}
              noValidate
            >
              {error && <p className={formStyles.formError}>{error}</p>}
              <div className={formStyles.field}>
                <label className={formStyles.label} htmlFor="new-password">
                  New password
                </label>
                <div className={formStyles.inputWrap}>
                  <Lock size={15} className={formStyles.inputIcon} />
                  <input
                    className={formStyles.input}
                    id="new-password"
                    type="password"
                    placeholder="At least 8 characters"
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
                {status === "submitting" ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
