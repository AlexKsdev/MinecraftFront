"use client";

import { useState } from "react";
import { categories } from "../constants";
import { WikiHeader } from "./WikiHeader";
import { CategoryNav } from "./CategoryNav";
import { WikiCategoryCard } from "./WikiCategoryCard";
import styles from "./WikiBrowser.module.scss";

export function WikiBrowser() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          search === "" ||
          article.title.toLowerCase().includes(search.toLowerCase()) ||
          article.desc.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((category) => category.articles.length > 0)
    .filter((category) => !activeCategory || category.id === activeCategory);

  return (
    <>
      <WikiHeader search={search} onSearchChange={setSearch} />
      <div className={styles.body}>
        <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />
        <div className={styles.grid}>
          {filtered.map((category) => (
            <WikiCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </>
  );
}
