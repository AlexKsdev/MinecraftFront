"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { User, Shield, X } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import styles from "./AuthModal.module.scss";

export function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const t = useTranslations("Auth");
  const benefits = t.raw("modal.benefits") as string[];

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label={t("modal.close")} type="button">
          <X size={18} />
        </button>

        <div className={styles.header}>
          <div className={styles.avatar}>
            <User size={28} />
          </div>
          <h2 className={styles.title}>{t("modal.title")}</h2>
          <p className={styles.subtitle}>{t("modal.subtitle")}</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
            onClick={() => setTab("login")}
            type="button"
          >
            {t("modal.loginTab")}
          </button>
          <button
            className={`${styles.tab} ${tab === "register" ? styles.active : ""}`}
            onClick={() => setTab("register")}
            type="button"
          >
            {t("modal.registerTab")}
          </button>
        </div>

        {tab === "login" ? <LoginForm onClose={onClose} /> : <RegisterForm onClose={onClose} />}

        <div className={styles.divider}>
          <span>{t("modal.or")}</span>
        </div>

        <div className={styles.benefits}>
          <p className={styles.benefitsTitle}>{t("modal.benefitsTitle")}</p>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit) => (
              <li key={benefit} className={styles.benefitItem}>
                <Shield size={11} className={styles.benefitIcon} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
