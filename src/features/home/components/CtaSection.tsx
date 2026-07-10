import Link from "next/link";
import { User } from "lucide-react";
import { CopyServerIp } from "@/components/CopyServerIp/CopyServerIp";
import { SERVER_IP } from "../constants";
import styles from "./CtaSection.module.scss";

export function CtaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>Ready to play?</h2>
        <p className={styles.subtitle}>
          Join thousands of players and start your adventure today. No
          downloads required — just your Minecraft client.
        </p>
        <div className={styles.actions}>
          <CopyServerIp serverIp={SERVER_IP} />
          <Link href="/account" className={styles.accountButton}>
            <User size={14} /> Create account
          </Link>
        </div>
      </div>
    </section>
  );
}
