import { useTranslations } from "next-intl";
import { plans } from "../constants";
import { PricingCard } from "./PricingCard";
import styles from "./PricingSection.module.scss";

export function PricingSection() {
  const t = useTranslations("Home");
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{t("pricing.heading")}</h2>
        <p className={styles.subtitle}>{t("pricing.subtitle")}</p>
      </div>
      <div className={styles.grid}>
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}
