import Link from "next/link";
import type { plans } from "../constants";
import styles from "./PricingCard.module.scss";

export function PricingCard({ plan }: { plan: (typeof plans)[number] }) {
  return (
    <div className={`${styles.card} ${plan.featured ? styles.featured : ""}`}>
      {plan.featured && <span className={styles.badge}>POPULAR</span>}
      <div className={styles.icon}>{plan.icon}</div>
      <h3 className={styles.name}>{plan.name}</h3>
      <div className={styles.price}>
        {plan.price}
        <span>/mo</span>
      </div>
      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature} className={styles.feature}>
            ✓ {feature}
          </li>
        ))}
      </ul>
      <Link href="/shop" className={styles.cta}>
        Get {plan.name}
      </Link>
    </div>
  );
}
