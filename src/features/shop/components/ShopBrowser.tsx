"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, Coins, Gem } from "lucide-react";
import { getProfile, UnauthorizedError } from "@/lib/account/api";
import { publishBalances } from "@/lib/account/balances";
import { useSession } from "@/lib/auth/useSession";
import {
  getProducts,
  getGemPacks,
  createCheckout,
  formatPrice,
  type Product,
  type ProductSort,
  type PurchaseResult,
  type GemPack,
} from "@/lib/shop/api";
import { categories } from "../constants";
import { ItemCard } from "./ItemCard";
import styles from "./ShopBrowser.module.scss";

const PAGE_SIZE = 6;
// Products load fast enough locally that the skeleton can flash on and off
// within a few dozen ms, which reads as flicker rather than "loading". This
// floor makes the loading state visible for at least this long — but never
// adds delay on top of a response that's already slower than it.
const MIN_LOADING_MS = 400;

const SORT_OPTIONS: { value: "" | ProductSort; id: string }[] = [
  { value: "", id: "featured" },
  { value: "coins_asc", id: "coinsAsc" },
  { value: "coins_desc", id: "coinsDesc" },
  { value: "gems_asc", id: "gemsAsc" },
  { value: "gems_desc", id: "gemsDesc" },
  { value: "rarity_desc", id: "rarityDesc" },
  { value: "rarity_asc", id: "rarityAsc" },
];

type PaymentBanner = "success" | "cancelled" | null;

function readPaymentBanner(): PaymentBanner {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("payment");
  return value === "success" || value === "cancelled" ? value : null;
}

export function ShopBrowser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<"" | ProductSort>("");
  const [page, setPage] = useState(1);

  const [packs, setPacks] = useState<GemPack[]>([]);
  const [checkoutPack, setCheckoutPack] = useState<string | null>(null);
  const [banner, setBanner] = useState<PaymentBanner>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  const session = useSession();
  const isAuthed = session !== null;
  const t = useTranslations("Shop");

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCategoryId =
    categories.find((c) => c.value === activeCategory)?.id ?? "all";

  // One-time: gem packs, balances, and the Stripe redirect banner.
  useEffect(() => {
    let active = true;

    getGemPacks()
      .then((list) => active && setPacks(list))
      .catch(() => {});

    getProfile()
      .then((p) => active && publishBalances({ coins: p.coins, gems: p.gems }))
      .catch((err: unknown) => {
        if (!active || err instanceof UnauthorizedError) return;
      });

    // The ?payment= flag Stripe appends is only readable on the client (window).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBanner(readPaymentBanner());
    return () => {
      active = false;
    };
  }, []);

  // Re-fetch the current page whenever the filter, sort, or page changes.
  useEffect(() => {
    let active = true;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    const start = Date.now();
    // Show the loading state while the new page/filter/sort request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    // Applies the settled result, padding out to MIN_LOADING_MS if the
    // response came back faster than that so the skeleton doesn't flicker.
    function settle(apply: () => void) {
      if (!active) return;
      const remaining = MIN_LOADING_MS - (Date.now() - start);
      if (remaining > 0) {
        delayTimer = setTimeout(() => {
          if (active) apply();
        }, remaining);
      } else {
        apply();
      }
    }

    getProducts({
      page,
      limit: PAGE_SIZE,
      category: activeCategory,
      sort: sort || undefined,
    })
      .then((data) => {
        settle(() => {
          setProducts(data.items);
          setTotal(data.total);
          setError(null);
          setLoading(false);
        });
      })
      .catch((err: unknown) => {
        settle(() => {
          setError(err instanceof Error ? err.message : t("errors.loadFailed"));
          setLoading(false);
        });
      });

    return () => {
      active = false;
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [activeCategory, sort, page, t]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setPage(1);
  }

  function changeSort(value: "" | ProductSort) {
    setSort(value);
    setPage(1);
  }

  function handlePurchased(result: PurchaseResult) {
    publishBalances({ coins: result.coins, gems: result.gems });
    const symbol = result.currency === "GEMS" ? "💎" : "🪙";
    setToast({
      text: `${result.product.name} — −${result.price.toLocaleString("en-US")} ${symbol}`,
      ok: true,
    });
  }

  function handlePurchaseError(message: string) {
    setToast({ text: message, ok: false });
  }

  async function buyGems(pack: GemPack) {
    setCheckoutPack(pack.id);
    try {
      const { url } = await createCheckout(pack.id);
      window.location.assign(url);
    } catch (err: unknown) {
      setCheckoutPack(null);
      setBanner(null);
      setError(
        err instanceof UnauthorizedError
          ? t("errors.signInToBuyGems")
          : err instanceof Error
            ? err.message
            : t("errors.checkoutFailed"),
      );
    }
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
                    onPurchased={handlePurchased}
                    onError={handlePurchaseError}
                  />
                ))}
          </div>

          {!loading && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t("pagination.prev")}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`${styles.pageButton} ${n === page ? styles.pageActive : ""}`}
                  type="button"
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className={styles.pageButton}
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t("pagination.next")}
              </button>
            </div>
          )}
        </>
      )}

      {packs.length > 0 && (
        <section className={styles.topup}>
          <h2 className={styles.topupTitle}>
            <Gem size={16} /> {t("topup.title")}
          </h2>
          <p className={styles.topupHint}>{t("topup.hint")}</p>
          <div className={styles.packGrid}>
            {packs.map((pack) => (
              <div key={pack.id} className={styles.pack}>
                <span className={styles.packGems}>
                  <Gem size={14} />
                  {pack.gems.toLocaleString("en-US")}
                </span>
                <span className={styles.packName}>{pack.name}</span>
                <button
                  className={styles.packButton}
                  type="button"
                  onClick={() => void buyGems(pack)}
                  disabled={checkoutPack !== null}
                >
                  {checkoutPack === pack.id
                    ? t("topup.redirecting")
                    : formatPrice(pack.priceCents)}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {toast && (
        <div
          className={`${styles.toast} ${toast.ok ? "" : styles.toastError}`}
          role="status"
        >
          {toast.ok ? (
            <Coins size={16} className={styles.toastIcon} />
          ) : (
            <AlertCircle size={16} className={styles.toastIconError} />
          )}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
