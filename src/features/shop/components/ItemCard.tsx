"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { RARITY, type Rarity } from "../constants";
import {
  purchaseProduct,
  type Product,
  type PurchaseResult,
} from "@/lib/shop/api";
import { openAuthModal } from "@/lib/auth/api";
import { UnauthorizedError } from "@/lib/account/api";
import styles from "./ItemCard.module.scss";

type Status = "idle" | "buying" | "owned";

const FALLBACK_RARITY: Rarity = "Common";

export function ItemCard({
  product,
  isAuthed,
  onPurchased,
  onError,
}: {
  product: Product;
  isAuthed: boolean;
  onPurchased: (result: PurchaseResult) => void;
  onError: (message: string) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const t = useTranslations("Shop");

  const rarityKey =
    (product.rarity as Rarity) in RARITY
      ? (product.rarity as Rarity)
      : FALLBACK_RARITY;
  const rarity = RARITY[rarityKey];
  const isGems = product.currency === "GEMS";

  async function buy() {
    if (!isAuthed) {
      openAuthModal();
      return;
    }
    setStatus("buying");
    try {
      const result = await purchaseProduct(product.id);
      onPurchased(result);
      setStatus("owned");
    } catch (err: unknown) {
      setStatus("idle");
      onError(
        err instanceof UnauthorizedError
          ? t("errors.sessionExpired")
          : err instanceof Error
            ? err.message
            : t("errors.purchaseFailed"),
      );
      if (err instanceof UnauthorizedError) openAuthModal();
    }
  }

  return (
    <div className={`${styles.card} ${styles[rarity.accent]}`}>
      {product.badge && <span className={styles.badge}>{product.badge}</span>}

      <div className={styles.topRow}>
        <span className={styles.emoji}>{product.emoji}</span>
        <span className={styles.rarityBadge}>
          {t(`rarity.${rarityKey.toLowerCase()}`)}
        </span>
      </div>

      <h3 className={styles.name}>{product.name}</h3>

      <div className={styles.price}>
        <span>{isGems ? "💎" : "🪙"}</span>
        <span className={`${styles.priceValue} ${isGems ? styles.priceGems : ""}`}>
          {product.price.toLocaleString("en-US")}
        </span>
        <span className={styles.priceLabel}>
          {isGems ? t("currency.gems") : t("currency.coins")}
        </span>
      </div>

      <ul className={styles.stats}>
        {product.stats.map((stat) => (
          <li key={stat}>
            <Check size={10} className={styles.checkIcon} />
            {stat}
          </li>
        ))}
      </ul>

      <button
        className={styles.buyButton}
        type="button"
        onClick={buy}
        disabled={status === "buying" || status === "owned"}
      >
        {status === "buying"
          ? t("buy.buying")
          : status === "owned"
            ? t("buy.owned")
            : t("buy.buyNow")}
      </button>
    </div>
  );
}
