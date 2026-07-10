"use client";

import { useState } from "react";
import { categories, items } from "../constants";
import { ItemCard } from "./ItemCard";
import styles from "./ShopBrowser.module.scss";

export function ShopBrowser() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className={styles.browser}>
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ""}`}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <p className={styles.count}>
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} in{" "}
        <span className={styles.countHighlight}>{activeCategory}</span>
      </p>

      <div className={styles.grid}>
        {filtered.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
