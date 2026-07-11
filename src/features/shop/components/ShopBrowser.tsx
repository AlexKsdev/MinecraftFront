"use client";

import { useEffect, useState } from "react";
import { Coins, Gem } from "lucide-react";
import { getProfile, UnauthorizedError } from "@/lib/account/api";
import { useBalances, publishBalances } from "@/lib/account/balances";
import { useSession } from "@/lib/auth/useSession";
import {
  getProducts,
  getGemPacks,
  createCheckout,
  formatPrice,
  type Product,
  type PurchaseResult,
  type GemPack,
} from "@/lib/shop/api";
import { categories } from "../constants";
import { ItemCard } from "./ItemCard";
import styles from "./ShopBrowser.module.scss";

type PaymentBanner = "success" | "cancelled" | null;

function readPaymentBanner(): PaymentBanner {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("payment");
  return value === "success" || value === "cancelled" ? value : null;
}

export function ShopBrowser() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [packs, setPacks] = useState<GemPack[]>([]);
  const [checkoutPack, setCheckoutPack] = useState<string | null>(null);
  const [banner, setBanner] = useState<PaymentBanner>(null);
  const [toast, setToast] = useState<string | null>(null);

  const session = useSession();
  const isAuthed = session !== null;
  const balances = useBalances();

  useEffect(() => {
    let active = true;

    getProducts()
      .then((items) => active && setProducts(items))
      .catch(
        (err: unknown) =>
          active &&
          setError(err instanceof Error ? err.message : "Failed to load shop"),
      )
      .finally(() => active && setLoading(false));

    getGemPacks()
      .then((list) => active && setPacks(list))
      .catch(() => {});

    // Balances only matter when signed in; missing session is not an error here.
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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((item) => item.category === activeCategory);

  function handlePurchased(result: PurchaseResult) {
    publishBalances({ coins: result.coins, gems: result.gems });
    const symbol = result.currency === "GEMS" ? "💎" : "🪙";
    setToast(
      `${result.product.name} — −${result.price.toLocaleString("en-US")} ${symbol}`,
    );
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

      {isAuthed && balances && (
        <div className={styles.balances}>
          <span className={`${styles.balance} ${styles.balanceCoins}`}>
            <Coins size={14} />
            {balances.coins.toLocaleString("en-US")}
          </span>
          <span className={`${styles.balance} ${styles.balanceGems}`}>
            <Gem size={14} />
            {balances.gems.toLocaleString("en-US")}
          </span>
        </div>
      )}

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ""}`}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.count}>Loading items…</p>
      ) : error ? (
        <p className={styles.count}>{error}</p>
      ) : (
        <>
          <p className={styles.count}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} in{" "}
            <span className={styles.countHighlight}>{activeCategory}</span>
          </p>

          <div className={styles.grid}>
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                product={item}
                isAuthed={isAuthed}
                onPurchased={handlePurchased}
              />
            ))}
          </div>
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
        <div className={styles.toast} role="status">
          <Coins size={16} className={styles.toastIcon} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
