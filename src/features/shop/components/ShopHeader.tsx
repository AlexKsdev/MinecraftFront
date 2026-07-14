import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { RARITY, type Rarity } from "../constants";
import styles from "./ShopHeader.module.scss";

const RARITIES = Object.keys(RARITY) as Rarity[];

export function ShopHeader() {
  const t = useTranslations("Shop");
  return (
    <div className={styles.header}>
      <ShoppingBag size={32} className={styles.icon} />
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>
      <div className={styles.legend}>
        {RARITIES.map((rarity) => (
          <span
            key={rarity}
            className={`${styles.legendItem} ${styles[RARITY[rarity].accent]}`}
          >
            {t(`rarity.${rarity.toLowerCase()}`)}
          </span>
        ))}
      </div>
    </div>
  );
}
