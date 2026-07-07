import { plans } from "../constants";
import { PricingCard } from "./PricingCard";
import styles from "./PricingSection.module.scss";

export function PricingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Premium ranks</h2>
        <p className={styles.subtitle}>
          Upgrade your gameplay with exclusive perks, cosmetics, and
          privileges.
        </p>
      </div>
      <div className={styles.grid}>
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}
