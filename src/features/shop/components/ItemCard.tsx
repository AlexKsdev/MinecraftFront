import { Check } from "lucide-react";
import { RARITY, type ShopItem } from "../constants";
import styles from "./ItemCard.module.scss";

export function ItemCard({ item }: { item: ShopItem }) {
  const rarity = RARITY[item.rarity];

  return (
    <div className={`${styles.card} ${styles[rarity.accent]}`}>
      {item.badge && <span className={styles.badge}>{item.badge}</span>}

      <div className={styles.topRow}>
        <span className={styles.emoji}>{item.emoji}</span>
        <span className={styles.rarityBadge}>{rarity.label}</span>
      </div>

      <h3 className={styles.name}>{item.name}</h3>

      <div className={styles.price}>
        <span>🪙</span>
        <span className={styles.priceValue}>{item.price}</span>
        <span className={styles.priceLabel}>Coins</span>
      </div>

      <ul className={styles.stats}>
        {item.stats.map((stat) => (
          <li key={stat}>
            <Check size={10} className={styles.checkIcon} />
            {stat}
          </li>
        ))}
      </ul>

      <button className={styles.buyButton} type="button">
        Buy Now
      </button>
    </div>
  );
}
