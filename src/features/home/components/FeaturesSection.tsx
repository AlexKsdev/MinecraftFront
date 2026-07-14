import { useTranslations } from "next-intl";
import { features } from "../constants";
import styles from "./FeaturesSection.module.scss";

export function FeaturesSection() {
  const t = useTranslations("Home");
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{t("features.heading")}</h2>
        <p className={styles.subtitle}>{t("features.subtitle")}</p>
      </div>
      <div className={styles.grid}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.card}>
            <feature.icon
              className={`${styles.icon} ${styles[feature.accent]}`}
              size={28}
            />
            <h3 className={styles.cardTitle}>{t(`features.${feature.id}.title`)}</h3>
            <p className={styles.cardDesc}>{t(`features.${feature.id}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
