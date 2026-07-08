import { ChevronRight } from "lucide-react";
import type { WikiCategory } from "../constants";
import styles from "./WikiCategoryCard.module.scss";

export function WikiCategoryCard({ category }: { category: WikiCategory }) {
  return (
    <div className={`${styles.card} ${styles[category.accent]}`}>
      <div className={styles.header}>
        <span className={styles.iconWrap}>
          <category.icon size={18} />
        </span>
        <h2 className={styles.title}>{category.title}</h2>
      </div>
      <ul className={styles.list}>
        {category.articles.map((article) => (
          <li key={article.title} className={styles.item}>
            <div>
              <p className={styles.articleTitle}>{article.title}</p>
              <p className={styles.articleDesc}>{article.desc}</p>
            </div>
            <ChevronRight size={14} className={styles.chevron} />
          </li>
        ))}
      </ul>
    </div>
  );
}
