"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sword, X } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import styles from "./SiteHeader.module.scss";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoAccent}>Pure</span>Craft
        </Link>

        <nav className={styles.desktopNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.cta}
            onClick={() => setAuthOpen(true)}
            type="button"
          >
            <Sword size={12} /> Join Now
          </button>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            type="button"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <MobileNav
          links={NAV_LINKS}
          pathname={pathname}
          onNavigate={() => setMenuOpen(false)}
          onJoinClick={() => {
            setMenuOpen(false);
            setAuthOpen(true);
          }}
        />
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
