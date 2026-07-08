import Link from "next/link";
import { Sword, Swords } from "lucide-react";
import { CopyServerIp } from "@/components/CopyServerIp/CopyServerIp";
import { SERVER_IP } from "../constants";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundImage} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.badge}>
          <Swords size={12} /> Survival · PvP · Economy
        </span>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>Pure</span>Craft
        </h1>
        <p className={styles.subtitle}>
          The ultimate Minecraft survival experience. Forge your legend, build
          your empire, and conquer the world.
        </p>
        <div className={styles.actions}>
          <CopyServerIp serverIp={SERVER_IP} />
          <Link href="/shop" className={styles.playButton}>
            <Sword size={14} /> Play now
          </Link>
        </div>
      </div>
    </section>
  );
}
