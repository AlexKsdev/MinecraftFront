"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Gem } from "lucide-react";
import { getProfile, UnauthorizedError } from "@/lib/account/api";
import styles from "./CheckoutSuccessView.module.scss";

export function CheckoutSuccessView() {
  const t = useTranslations("Checkout");
  const [gems, setGems] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    // Best-effort: the webhook credits gems around redirect time, so show the
    // fresh balance if it's ready; the thank-you stands on its own otherwise.
    getProfile()
      .then((p) => active && setGems(p.gems))
      .catch((err: unknown) => {
        if (err instanceof UnauthorizedError) return;
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.icon}>
          <CheckCircle2 size={48} />
        </span>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.text}>{t("text")}</p>

        {gems !== null && (
          <div className={styles.balance}>
            <Gem size={16} />
            {t("gems", { count: gems })}
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/shop" className={styles.primaryBtn}>
            {t("backToShop")}
          </Link>
          <Link href="/account" className={styles.secondaryBtn}>
            {t("viewAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}
