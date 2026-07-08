import { BookMarked, Search } from "lucide-react";
import styles from "./WikiHeader.module.scss";

export function WikiHeader({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className={styles.header}>
      <BookMarked size={32} className={styles.icon} />
      <h1 className={styles.title}>Wiki</h1>
      <p className={styles.subtitle}>
        Everything you need to know about PureCraft.
      </p>
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </div>
  );
}
