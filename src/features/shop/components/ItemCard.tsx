"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { RARITY, type Rarity } from "../constants";
import {
  purchaseProduct,
  type Product,
  type PurchaseResult,
} from "@/lib/shop/api";
import { UnauthorizedError } from "@/lib/account/api";
import styles from "./ItemCard.module.scss";

type Status = "idle" | "buying" | "owned" | "error";

const FALLBACK_RARITY: Rarity = "Common";

export function ItemCard({
  product,
  isAuthed,
  onPurchased,
}: {
  product: Product;
  isAuthed: boolean;
  onPurchased: (result: PurchaseResult) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const rarity = RARITY[(product.rarity as Rarity) in RARITY ? (product.rarity as Rarity) : FALLBACK_RARITY];
  const isGems = product.currency === "GEMS";

  async function buy() {
    if (!isAuthed) {
      setStatus("error");
      setMessage("Sign in to buy items");
      return;
    }
    setStatus("buying");
    setMessage(null);
    try {
      const result = await purchaseProduct(product.id);
      onPurchased(result);
      setStatus("owned");
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof UnauthorizedError) {
        setMessage("Session expired — sign in again");
      } else {
        setMessage(err instanceof Error ? err.message : "Purchase failed");
      }
    }
  }

  return (
    <div className={`${styles.card} ${styles[rarity.accent]}`}>
      {product.badge && <span className={styles.badge}>{product.badge}</span>}

      <div className={styles.topRow}>
        <span className={styles.emoji}>{product.emoji}</span>
        <span className={styles.rarityBadge}>{rarity.label}</span>
      </div>

      <h3 className={styles.name}>{product.name}</h3>

      <div className={styles.price}>
        <span>{isGems ? "💎" : "🪙"}</span>
        <span className={`${styles.priceValue} ${isGems ? styles.priceGems : ""}`}>
          {product.price.toLocaleString("en-US")}
        </span>
        <span className={styles.priceLabel}>{isGems ? "Gems" : "Coins"}</span>
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
          ? "Buying…"
          : status === "owned"
            ? "Purchased ✓"
            : "Buy Now"}
      </button>

      {message && <p className={styles.buyMessage}>{message}</p>}
    </div>
  );
}
