"use client";

import { useEffect, useState } from "react";
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

const SORT_OPTIONS: { value: "" | ProductSort; label: string }[] = [
  { value: "", label: "Featured" },
  { value: "coins_asc", label: "Coins: Low to High" },
  { value: "coins_desc", label: "Coins: High to Low" },
  { value: "gems_asc", label: "Gems: Low to High" },
  { value: "gems_desc", label: "Gems: High to Low" },
  { value: "rarity_desc", label: "Rarity: High to Low" },
  { value: "rarity_asc", label: "Rarity: Low to High" },
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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
    // Show the loading state while the new page/filter/sort request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getProducts({
      page,
      limit: PAGE_SIZE,
      category: activeCategory,
      sort: sort || undefined,
    })
      .then((data) => {
        if (!active) return;
        setProducts(data.items);
        setTotal(data.total);
        setError(null);
      })
      .catch(
        (err: unknown) =>
          active &&
          setError(err instanceof Error ? err.message : "Failed to load shop"),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [activeCategory, sort, page]);

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
          ? "Sign in to buy gems"
          : err instanceof Error
            ? err.message
            : "Could not start checkout",
      );
    }
  }

  return (
    <div className={styles.browser}>
      {banner === "success" && (
        <div className={`${styles.banner} ${styles.bannerOk}`}>
          Payment successful — your gems are on the way!
        </div>
      )}
      {banner === "cancelled" && (
        <div className={`${styles.banner} ${styles.bannerWarn}`}>
          Checkout cancelled. No charge was made.
        </div>
      )}

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => selectCategory(category)}
            className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ""}`}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <p className={styles.count}>
          {loading ? (
            "Loading items…"
          ) : error ? (
            error
          ) : (
            <>
              {total} item{total !== 1 ? "s" : ""} in{" "}
              <span className={styles.countHighlight}>{activeCategory}</span>
            </>
          )}
        </p>

        <select
          className={styles.sort}
          value={sort}
          onChange={(e) => changeSort(e.target.value as "" | ProductSort)}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {products.map((item) => (
              <ItemCard
                key={item.id}
                product={item}
                isAuthed={isAuthed}
                onPurchased={handlePurchased}
                onError={handlePurchaseError}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
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
                Next
              </button>
            </div>
          )}
        </>
      )}

      {packs.length > 0 && (
        <section className={styles.topup}>
          <h2 className={styles.topupTitle}>
            <Gem size={16} /> Need more gems?
          </h2>
          <p className={styles.topupHint}>
            Buy gems with real money to unlock legendary gear.
          </p>
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
                    ? "Redirecting…"
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
