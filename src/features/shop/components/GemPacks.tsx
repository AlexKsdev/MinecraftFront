import { useTranslations } from "next-intl";
import { Gem } from "lucide-react";
import { formatPrice, type GemPack } from "@/lib/shop/api";
import styles from "./ShopBrowser.module.scss";

interface GemPacksProps {
  packs: GemPack[];
  checkoutPack: string | null;
  onBuy: (pack: GemPack) => void;
}

export function GemPacks({ packs, checkoutPack, onBuy }: GemPacksProps) {
  const t = useTranslations("Shop");
  return (
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
              onClick={() => onBuy(pack)}
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
  );
}
