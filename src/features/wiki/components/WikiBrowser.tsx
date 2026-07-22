"use client";

import { useState } from "react";
import type { WikiCategory } from "../types";
import { CategoryNav } from "./CategoryNav";
import { WikiCategoryCard } from "./WikiCategoryCard";
import styles from "./WikiBrowser.module.scss";

/**
 * Search runs on the server (see WikiListView); the category filter stays here
 * because every category is already loaded — narrowing to one is a local view
 * choice, not a query.
 */
export function WikiBrowser({ categories }: { categories: WikiCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const shown = activeCategory
    ? categories.filter((category) => category.key === activeCategory)
    : categories;

  return (
    <div className={styles.body}>
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className={styles.grid}>
        {shown.map((category) => (
          <WikiCategoryCard key={category.key} category={category} />
        ))}
      </div>
    </div>
  );
}
