import { ShoppingBag } from "lucide-react";
import { RARITY, type Rarity } from "../constants";
import styles from "./ShopHeader.module.scss";

const RARITIES = Object.keys(RARITY) as Rarity[];

export function ShopHeader() {
  return (
    <div className={styles.header}>
      <ShoppingBag size={32} className={styles.icon} />
      <h1 className={styles.title}>Item Shop</h1>
      <p className={styles.subtitle}>
        Buy weapons, armor, tools, food, and more — all delivered straight to
        your in-game inventory.
      </p>
      <div className={styles.legend}>
        {RARITIES.map((rarity) => (
          <span
            key={rarity}
            className={`${styles.legendItem} ${styles[RARITY[rarity].accent]}`}
          >
            {RARITY[rarity].label}
          </span>
        ))}
      </div>
    </div>
  );
}
