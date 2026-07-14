import { Link } from "@/i18n/navigation";
import { Sword } from "lucide-react";
import type { MobileNavProps } from "./types";
import styles from "./MobileNav.module.scss";

export function MobileNav({
  links,
  pathname,
  onNavigate,
  onJoinClick,
}: MobileNavProps) {
  return (
    <div className={styles.panel}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
        >
          {link.label}
        </Link>
      ))}
      <button className={styles.cta} onClick={onJoinClick} type="button">
        <Sword size={14} /> Join Now
      </button>
    </div>
  );
}
