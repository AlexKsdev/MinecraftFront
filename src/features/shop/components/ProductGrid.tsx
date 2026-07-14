import type { Product, PurchaseResult } from "@/lib/shop/api";
import { PAGE_SIZE } from "../constants";
import { ItemCard } from "./ItemCard";
import styles from "./ShopBrowser.module.scss";

interface ProductGridProps {
  loading: boolean;
  products: Product[];
  isAuthed: boolean;
  onPurchased: (result: PurchaseResult) => void;
  onError: (message: string) => void;
}

export function ProductGrid({
  loading,
  products,
  isAuthed,
  onPurchased,
  onError,
}: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {loading
        ? Array.from({ length: PAGE_SIZE }, (_, i) => (
            <div key={i} className={styles.skeletonCard} aria-hidden="true">
              <div className={styles.skeletonTopRow}>
                <span className={styles.skeletonEmoji} />
                <span className={styles.skeletonBadge} />
              </div>
              <span className={styles.skeletonName} />
              <span className={styles.skeletonPrice} />
              <div className={styles.skeletonStats}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.skeletonButton} />
            </div>
          ))
        : products.map((item) => (
            <ItemCard
              key={item.id}
              product={item}
              isAuthed={isAuthed}
              onPurchased={onPurchased}
              onError={onError}
            />
          ))}
    </div>
  );
}
