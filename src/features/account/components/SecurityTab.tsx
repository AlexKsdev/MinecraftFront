"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, ShieldOff } from "lucide-react";
import {
  disableTwoFactor,
  enableTwoFactor,
  requestDisableCode,
  setupTwoFactor,
} from "@/lib/auth/api";
import { useErrorText } from "@/lib/auth/errors";
import type { Profile } from "@/lib/account/api";
import styles from "../AccountView.module.scss";

type Mode = "idle" | "enrolling" | "disabling";

/**
 * 2FA management. `enabled` starts from the server's view of the account
 * (/users/me) and only moves once the server has confirmed the change, so a
 * reload never disagrees with what's shown here. The second factor is a code
 * emailed at login — enabling and disabling both confirm an emailed code.
 */
export function SecurityTab({ player }: { player: Profile }) {
  const t = useTranslations("Account");
  const errorText = useErrorText();
  const [enabled, setEnabled] = useState(player.twoFactorEnabled);
  const [mode, setMode] = useState<Mode>("idle");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setMode("idle");
    setCode("");
    setPassword("");
    setError(null);
    setBusy(false);
  }

  // Both flows start by asking the server to email a code, then switch to the
  // form that collects it.
  async function sendCode(kind: "enrolling" | "disabling") {
    setBusy(true);
    setError(null);
    try {
      await (kind === "enrolling" ? setupTwoFactor() : requestDisableCode());
      setMode(kind);
    } catch (err) {
      setError(errorText(err, t("security.genericError")));
    } finally {
      setBusy(false);
    }
  }

  async function confirmEnable(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await enableTwoFactor(code);
      setEnabled(true);
      reset();
    } catch (err) {
      setBusy(false);
      setCode("");
      setError(errorText(err, t("security.genericError")));
    }
  }

  async function confirmDisable(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await disableTwoFactor(password, code);
      setEnabled(false);
      reset();
    } catch (err) {
      setBusy(false);
      setCode("");
      setError(errorText(err, t("security.genericError")));
    }
  }

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <div className={styles.rowBetween}>
          <h2 className={styles.cardTitle}>{t("security.twoFactorTitle")}</h2>
          <span className={enabled ? styles.accentPrimary : styles.muted}>
            {enabled ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}{" "}
            {enabled ? t("security.on") : t("security.off")}
          </span>
        </div>
        <p className={styles.muted}>{t("security.twoFactorText")}</p>

        {error && <p className={styles.securityError}>{error}</p>}

        {mode === "idle" && !enabled && (
          <button
            className={styles.primaryBtn}
            type="button"
            onClick={() => void sendCode("enrolling")}
            disabled={busy}
          >
            {busy ? t("security.sending") : t("security.enable")}
          </button>
        )}

        {mode === "idle" && enabled && (
          <button
            className={styles.primaryBtn}
            type="button"
            onClick={() => void sendCode("disabling")}
            disabled={busy}
          >
            {busy ? t("security.sending") : t("security.disable")}
          </button>
        )}

        {mode === "enrolling" && (
          <form onSubmit={(e) => void confirmEnable(e)} noValidate>
            <p className={styles.muted}>{t("security.codeSentHint")}</p>
            <input
              className={styles.codeInput}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder={t("security.codePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <button
              className={styles.primaryBtn}
              type="submit"
              disabled={busy || code.length !== 6}
            >
              {busy ? t("security.confirming") : t("security.confirmEnable")}
            </button>
            <button className={styles.linkBtn} type="button" onClick={reset}>
              {t("security.cancel")}
            </button>
          </form>
        )}

        {mode === "disabling" && (
          <form onSubmit={(e) => void confirmDisable(e)} noValidate>
            <p className={styles.muted}>{t("security.disableHint")}</p>
            <input
              className={styles.codeInput}
              type="password"
              autoComplete="current-password"
              placeholder={t("security.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className={styles.codeInput}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder={t("security.codePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <button
              className={styles.primaryBtn}
              type="submit"
              disabled={busy || code.length !== 6 || password.length === 0}
            >
              {busy ? t("security.confirming") : t("security.confirmDisable")}
            </button>
            <button className={styles.linkBtn} type="button" onClick={reset}>
              {t("security.cancel")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
