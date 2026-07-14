"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/auth/schemas";
import { login, storeSession, forgotPassword } from "@/lib/auth/api";
import styles from "./AuthForm.module.scss";

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await forgotPassword(email);
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.form}>
        <p className={styles.label}>{t("forgot.sent")}</p>
        <button className={styles.forgot} type="button" onClick={onBack}>
          {t("forgot.backToLogin")}
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={(e) => void onSubmit(e)} noValidate>
      {error && <p className={styles.formError}>{error}</p>}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="forgot-email">
          {t("fields.email")}
        </label>
        <div className={styles.inputWrap}>
          <Mail size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="forgot-email"
            type="email"
            placeholder={t("fields.emailPlaceholder")}
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <button className={styles.submit} type="submit" disabled={status === "sending"}>
        {status === "sending" ? t("forgot.sending") : t("forgot.sendLink")}
      </button>
      <button className={styles.forgot} type="button" onClick={onBack}>
        {t("forgot.backToLogin")}
      </button>
    </form>
  );
}

export function LoginForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Auth");
  const [showPass, setShowPass] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await login(values);
      storeSession(res);
      onClose();
      router.push("/account");
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : t("errors.loginFailed"),
      });
    }
  });

  if (forgotMode) {
    return <ForgotPasswordForm onBack={() => setForgotMode(false)} />;
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {errors.root && <p className={styles.formError}>{errors.root.message}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">
          {t("fields.email")}
        </label>
        <div className={styles.inputWrap}>
          <Mail size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="login-email"
            type="email"
            placeholder={t("fields.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          {t("fields.password")}
        </label>
        <div className={styles.inputWrap}>
          <Lock size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="login-password"
            type={showPass ? "text" : "password"}
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
            {...register("password")}
          />
          <button
            className={styles.toggle}
            type="button"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? t("fields.hidePassword") : t("fields.showPassword")}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("login.submitting") : t("login.submit")}
      </button>
      <button className={styles.forgot} type="button" onClick={() => setForgotMode(true)}>
        {t("login.forgotPassword")}
      </button>
    </form>
  );
}
