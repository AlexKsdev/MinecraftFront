import { useTranslations } from "next-intl";
import { BookMarked, Search } from "lucide-react";
import styles from "./WikiHeader.module.scss";

export function WikiHeader({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const t = useTranslations("Wiki");
  return (
    <div className={styles.header}>
      <BookMarked size={32} className={styles.icon} />
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
}
