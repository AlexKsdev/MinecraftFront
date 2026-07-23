import { useTranslations } from "next-intl";
import { stats } from "../constants";
import styles from "./StatsSection.module.scss";

export function StatsSection() {
  const t = useTranslations("Home");
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.id}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{t(`stats.${stat.id}`)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
