import { features } from "../constants";
import styles from "./FeaturesSection.module.scss";

export function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Why PureCraft?</h2>
        <p className={styles.subtitle}>
          We&apos;ve built the perfect Minecraft experience — balanced,
          exciting, and always improving.
        </p>
      </div>
      <div className={styles.grid}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.card}>
            <feature.icon
              className={`${styles.icon} ${styles[feature.accent]}`}
              size={28}
            />
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDesc}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
