import Link from "next/link";
import styles from "./MobileNav.module.scss";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  pathname,
  onNavigate,
}: {
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
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
      <Link href="/shop" onClick={onNavigate} className={styles.cta}>
        Play now
      </Link>
    </div>
  );
}
