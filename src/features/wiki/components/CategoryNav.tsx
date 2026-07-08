import { categories } from "../constants";
import styles from "./CategoryNav.module.scss";

export function CategoryNav({
  activeCategory,
  onSelect,
}: {
  activeCategory: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className={styles.nav}>
      <button
        onClick={() => onSelect(null)}
        className={`${styles.button} ${!activeCategory ? styles.active : ""}`}
        type="button"
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() =>
            onSelect(activeCategory === category.id ? null : category.id)
          }
          className={`${styles.button} ${activeCategory === category.id ? styles.active : ""}`}
          type="button"
        >
          {category.title}
        </button>
      ))}
    </div>
  );
}
