"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/auth/schemas";
import { registerUser, notifySignedIn } from "@/lib/auth/api";
import { useErrorText } from "@/lib/auth/errors";
import styles from "./AuthForm.module.scss";

export function RegisterForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Auth");
  const errorText = useErrorText();
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser(values);
      notifySignedIn();
      onClose();
      router.push("/account");
    } catch (err) {
      setError("root", {
        message: errorText(err, t("errors.registrationFailed")),
      });
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {errors.root && <p className={styles.formError}>{errors.root.message}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-name">
          {t("fields.name")}
        </label>
        <div className={styles.inputWrap}>
          <User size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="register-name"
            type="text"
            placeholder={t("register.namePlaceholder")}
            autoComplete="name"
            {...register("name")}
          />
        </div>
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-email">
          {t("fields.email")}
        </label>
        <div className={styles.inputWrap}>
          <Mail size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="register-email"
            type="email"
            placeholder={t("fields.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-password">
          {t("fields.password")}
        </label>
        <div className={styles.inputWrap}>
          <Lock size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="register-password"
            type={showPass ? "text" : "password"}
            placeholder={t("register.passwordPlaceholder")}
            autoComplete="new-password"
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
        {isSubmitting ? t("register.submitting") : t("register.submit")}
      </button>
    </form>
  );
}
