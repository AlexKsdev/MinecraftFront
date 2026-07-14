import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import type { plans } from "../constants";
import styles from "./PricingCard.module.scss";

export function PricingCard({ plan }: { plan: (typeof plans)[number] }) {
  const t = useTranslations("Home");
  const features = t.raw(`plans.${plan.id}.features`) as string[];
  return (
    <div
      className={`${styles.card} ${styles[plan.accent]} ${plan.featured ? styles.featured : ""}`}
    >
      {plan.featured && <span className={styles.badge}>{t("pricing.popular")}</span>}
      <plan.icon className={styles.icon} size={28} />
      <h3 className={styles.name}>{plan.name}</h3>
      <div className={styles.price}>
        {plan.price}
        <span>{t("pricing.perMonth")}</span>
      </div>
      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <Check size={14} className={styles.checkIcon} />
            {feature}
          </li>
        ))}
      </ul>
      <Link href="/shop" className={styles.cta}>
        {t("pricing.getPlan", { plan: plan.name })}
      </Link>
    </div>
  );
}
