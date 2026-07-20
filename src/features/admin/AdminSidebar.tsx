"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LayoutDashboard, Package, Receipt, Target, Users } from "lucide-react";
import styles from "./AdminSidebar.module.scss";

const ITEMS = [
  { href: "/admin", key: "dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/users", key: "players", Icon: Users, exact: false },
  { href: "/admin/products", key: "products", Icon: Package, exact: false },
  { href: "/admin/orders", key: "orders", Icon: Receipt, exact: false },
  { href: "/admin/quests", key: "quests", Icon: Target, exact: false },
] as const;

/**
 * The panel's own navigation. `/admin` matches exactly so it doesn't stay lit on
 * every sub-page; the rest match their route prefix so they hold while you page
 * or filter within a section.
 */
export function AdminSidebar() {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label={t("nav.label")}>
      {ITEMS.map(({ href, key, Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.item} ${active ? styles.active : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={16} className={styles.icon} />
            <span>{t(`nav.${key}`)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
