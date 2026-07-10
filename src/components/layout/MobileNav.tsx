import Link from "next/link";
import { Sword } from "lucide-react";
import styles from "./MobileNav.module.scss";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  pathname,
  onNavigate,
  onJoinClick,
}: {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
  onJoinClick: () => void;
}) {
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
