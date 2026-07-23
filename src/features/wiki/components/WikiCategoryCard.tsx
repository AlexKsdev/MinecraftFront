import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { WIKI_FALLBACK_ICON, WIKI_ICON_MAP } from "../constants";
import type { WikiCategory } from "../types";
import styles from "./WikiCategoryCard.module.scss";

export function WikiCategoryCard({ category }: { category: WikiCategory }) {
  const Icon = WIKI_ICON_MAP[category.icon] ?? WIKI_FALLBACK_ICON;

  return (
    <div className={`${styles.card} ${styles[category.accent]}`}>
      <div className={styles.header}>
        <span className={styles.iconWrap}>
          <Icon size={18} />
        </span>
        <h2 className={styles.title}>{category.title}</h2>
      </div>
      <ul className={styles.list}>
        {category.articles.map((article) => (
          <li key={article.slug}>
            {/* The chevron used to point at nothing — these rows had no slug
                and were not links at all until the wiki moved to the API. */}
            <Link href={`/wiki/${article.slug}`} className={styles.item}>
              <div>
                <p className={styles.articleTitle}>{article.title}</p>
                <p className={styles.articleDesc}>{article.summary}</p>
              </div>
              <ChevronRight size={14} className={styles.chevron} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
