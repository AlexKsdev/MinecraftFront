import Link from "next/link";
import { Check } from "lucide-react";
import type { plans } from "../constants";
import styles from "./PricingCard.module.scss";

export function PricingCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div
      className={`${styles.card} ${styles[plan.accent]} ${plan.featured ? styles.featured : ""}`}
    >
      {plan.featured && <span className={styles.badge}>POPULAR</span>}
      <plan.icon className={styles.icon} size={28} />
      <h3 className={styles.name}>{plan.name}</h3>
      <div className={styles.price}>
        {plan.price}
        <span>/mo</span>
      </div>
      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            <Check size={14} className={styles.checkIcon} />
            {feature}
          </li>
        ))}
      </ul>
      <Link href="/shop" className={styles.cta}>
        Get {plan.name}
      </Link>
    </div>
  );
}
