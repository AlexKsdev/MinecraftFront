"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVER_IP } from "@/constants";
import styles from "./SiteFooter.module.scss";

export function SiteFooter() {
  const t = useTranslations("Footer");

  const navigationLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/shop", label: t("nav.shop") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/wiki", label: t("nav.wiki") },
  ];

  const communityLinks = [
    { href: "/account", label: t("community.account") },
    { href: "/wiki", label: t("community.rules") },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <span className={styles.brand}>
              <span className={styles.brandAccent}>Pure</span>Craft
            </span>
            <p className={styles.tagline}>{t("tagline")}</p>
            <span className={styles.ipBadge}>
              <span className={styles.ipDot} />
              {SERVER_IP}
            </span>
          </div>

          <div>
            <h4 className={styles.heading}>{t("navigationHeading")}</h4>
            <ul className={styles.list}>
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.heading}>{t("communityHeading")}</h4>
            <ul className={styles.list}>
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{t("copyright")}</span>
          <span>{t("madeWith")}</span>
        </div>
      </div>
    </footer>
  );
}
