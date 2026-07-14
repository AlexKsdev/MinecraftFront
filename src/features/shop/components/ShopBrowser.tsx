"use client";

import { useTranslations } from "next-intl";
import { publishBalances } from "@/lib/account/balances";
import { useSession } from "@/lib/auth/useSession";
import { type ProductSort, type PurchaseResult } from "@/lib/shop/api";
import { categories, SORT_OPTIONS } from "../constants";
import { useProducts } from "../hooks/useProducts";
import { useGemCheckout } from "../hooks/useGemCheckout";
import { usePaymentBanner } from "../hooks/usePaymentBanner";
import { useToast } from "../hooks/useToast";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import { GemPacks } from "./GemPacks";
import { Toast } from "./Toast";
import styles from "./ShopBrowser.module.scss";

export function ShopBrowser() {
  const t = useTranslations("Shop");
  const session = useSession();
  const isAuthed = session !== null;

  const {
    products, total, loading, error, setError,
    activeCategory, activeCategoryId, sort, page, totalPages,
    setPage, selectCategory, changeSort,
  } = useProducts();
  const { banner, setBanner } = usePaymentBanner();
  const { packs, checkoutPack, buyGems } = useGemCheckout({ setError, setBanner });
  const { toast, showToast } = useToast();

  function handlePurchased(result: PurchaseResult) {
    publishBalances({ coins: result.coins, gems: result.gems });
    const symbol = result.currency === "GEMS" ? "💎" : "🪙";
    showToast(`${result.product.name} — −${result.price.toLocaleString("en-US")} ${symbol}`, true);
  }

  return (
    <div className={styles.browser}>
      {banner === "success" && (
        <div className={`${styles.banner} ${styles.bannerOk}`}>
          {t("banner.success")}
        </div>
      )}
      {banner === "cancelled" && (
        <div className={`${styles.banner} ${styles.bannerWarn}`}>
          {t("banner.cancelled")}
        </div>
      )}

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => selectCategory(category.value)}
            className={`${styles.categoryButton} ${activeCategory === category.value ? styles.active : ""}`}
            type="button"
          >
            {t(`categories.${category.id}`)}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <p className={styles.count}>
          {error ? (
            error
          ) : loading && products.length === 0 ? (
            t("loading")
          ) : (
            <>
              {t("itemCount", { count: total })}{" "}
              <span className={styles.countHighlight}>
                {t(`categories.${activeCategoryId}`)}
              </span>
            </>
          )}
        </p>

        <select
          className={styles.sort}
          value={sort}
          onChange={(e) => changeSort(e.target.value as "" | ProductSort)}
          aria-label={t("sortAria")}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {t(`sort.${option.id}`)}
            </option>
          ))}
        </select>
      </div>

      {!error && (
        <>
          <ProductGrid
            loading={loading}
            products={products}
            isAuthed={isAuthed}
            onPurchased={handlePurchased}
            onError={(message) => showToast(message, false)}
          />

          {!loading && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          )}
        </>
      )}

      {packs.length > 0 && (
        <GemPacks packs={packs} checkoutPack={checkoutPack} onBuy={buyGems} />
      )}

      {toast && <Toast toast={toast} />}
    </div>
  );
}
