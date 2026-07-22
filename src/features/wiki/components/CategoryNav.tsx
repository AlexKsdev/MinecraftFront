"use client";

import { useTranslations } from "next-intl";
import type { WikiCategory } from "../types";
import styles from "./CategoryNav.module.scss";

export function CategoryNav({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: WikiCategory[];
  activeCategory: string | null;
  onSelect: (key: string | null) => void;
}) {
  const t = useTranslations("Wiki");
  return (
    <div className={styles.nav}>
      <button
        onClick={() => onSelect(null)}
        className={`${styles.button} ${!activeCategory ? styles.active : ""}`}
        type="button"
      >
        {t("all")}
      </button>
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() =>
            onSelect(activeCategory === category.key ? null : category.key)
          }
          className={`${styles.button} ${activeCategory === category.key ? styles.active : ""}`}
          type="button"
        >
          {category.title}
        </button>
      ))}
    </div>
  );
}
