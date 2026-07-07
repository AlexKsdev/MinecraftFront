import Link from "next/link";
import { quickLinks } from "../constants";
import styles from "./QuickLinks.module.scss";

export function QuickLinks() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className={styles.link}>
            <span className={styles.icon}>{link.icon}</span>
            <span className={styles.label}>{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
