import Link from "next/link";
import { CopyServerIp } from "@/components/CopyServerIp/CopyServerIp";
import { SERVER_IP } from "../constants";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div>
        <span className={styles.badge}>⚔ Survival · PvP · Economy</span>
        <h1 className={styles.title}>
          Minecraft<span className={styles.titleAccent}>Front</span>
        </h1>
        <p className={styles.subtitle}>
          The ultimate Minecraft survival experience. Forge your legend, build
          your empire, and conquer the world.
        </p>
        <div className={styles.actions}>
          <CopyServerIp serverIp={SERVER_IP} />
          <Link href="/shop" className={styles.playButton}>
            ⚔ Play now
          </Link>
        </div>
      </div>
    </section>
  );
}
