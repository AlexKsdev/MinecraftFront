import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import styles from "./BlogHeader.module.scss";

export function BlogHeader() {
  const t = useTranslations("Blog");
  return (
    <div className={styles.header}>
      <BookOpen size={32} className={styles.icon} />
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>
    </div>
  );
}
