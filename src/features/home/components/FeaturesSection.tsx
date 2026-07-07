import { features } from "../constants";
import styles from "./FeaturesSection.module.scss";

export function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Why MinecraftFront?</h2>
        <p className={styles.subtitle}>
          We&apos;ve built the perfect Minecraft experience — balanced,
          exciting, and always improving.
        </p>
      </div>
      <div className={styles.grid}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.card}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p className={styles.cardDesc}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
