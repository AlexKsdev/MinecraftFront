"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/auth/schemas";
import { registerUser, storeSession } from "@/lib/auth/api";
import styles from "./AuthForm.module.scss";

export function RegisterForm({ onClose }: { onClose: () => void }) {
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
      const res = await registerUser(values);
      storeSession(res);
      onClose();
      router.push("/account");
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Registration failed",
      });
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {errors.root && <p className={styles.formError}>{errors.root.message}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-name">
          Name
        </label>
        <div className={styles.inputWrap}>
          <User size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="register-name"
            type="text"
            placeholder="Your display name"
            autoComplete="name"
            {...register("name")}
          />
        </div>
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-email">
          Email
        </label>
        <div className={styles.inputWrap}>
          <Mail size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="register-email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="register-password">
          Password
        </label>
        <div className={styles.inputWrap}>
          <Lock size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="register-password"
            type={showPass ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            {...register("password")}
          />
          <button
            className={styles.toggle}
            type="button"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
