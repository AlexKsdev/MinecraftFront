"use client";

import Link from "next/link";
import { quickLinks } from "../constants";
import styles from "./QuickLinks.module.scss";

export function QuickLinks() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={link.href === "#" ? (e) => e.preventDefault() : undefined}
            className={`${styles.link} ${styles[link.accent]}`}
          >
            <link.icon className={styles.icon} size={24} />
            <span className={styles.label}>{link.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
