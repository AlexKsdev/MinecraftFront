import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sword, Swords } from "lucide-react";
import { CopyServerIp } from "@/components/CopyServerIp/CopyServerIp";
import { SERVER_IP } from "../constants";
import styles from "./Hero.module.scss";

export function Hero() {
  const t = useTranslations("Home");
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundImage} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.badge}>
          <Swords size={12} /> {t("hero.badge")}
        </span>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>Pure</span>Craft
        </h1>
        <p className={styles.subtitle}>{t("hero.subtitle")}</p>
        <div className={styles.actions}>
          <CopyServerIp serverIp={SERVER_IP} />
          <Link href="/shop" className={styles.playButton}>
            <Sword size={14} /> {t("hero.playNow")}
          </Link>
        </div>
      </div>
    </section>
  );
}
