import { useTranslations } from "next-intl";
import styles from "./ShopBrowser.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  const t = useTranslations("Shop");
  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        {t("pagination.prev")}
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`${styles.pageButton} ${n === page ? styles.pageActive : ""}`}
          type="button"
          onClick={() => onPage(n)}
        >
          {n}
        </button>
      ))}
      <button
        className={styles.pageButton}
        type="button"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        {t("pagination.next")}
      </button>
    </div>
  );
}
