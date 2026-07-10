"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/auth/schemas";
import { login, storeSession } from "@/lib/auth/api";
import styles from "./AuthForm.module.scss";

export function LoginForm({ onClose }: { onClose: () => void }) {
  const [showPass, setShowPass] = useState(false);
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
        message: err instanceof Error ? err.message : "Login failed",
      });
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {errors.root && <p className={styles.formError}>{errors.root.message}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">
          Email
        </label>
        <div className={styles.inputWrap}>
          <Mail size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="login-email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            {...register("email")}
          />
        </div>
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-password">
          Password
        </label>
        <div className={styles.inputWrap}>
          <Lock size={15} className={styles.inputIcon} />
          <input
            className={styles.input}
            id="login-password"
            type={showPass ? "text" : "password"}
            placeholder="Your password"
            autoComplete="current-password"
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
        {isSubmitting ? "Logging in…" : "Login"}
      </button>
      <button className={styles.forgot} type="button">
        Forgot password?
      </button>
    </form>
  );
}
