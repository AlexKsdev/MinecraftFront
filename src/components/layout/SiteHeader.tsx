"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, Sword, X } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { UserMenu } from "./UserMenu";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { useSession } from "@/lib/auth/useSession";
import styles from "./SiteHeader.module.scss";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
];

const THEME_EVENT = "pc-themechange";

// Theme is applied to <html data-theme> pre-hydration by the inline script in
// layout; read it from there via an external store so there's no hydration flip.
function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
function getThemeSnapshot(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "dark");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pc-theme", next);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  // On the home page the header floats fully transparent (light text) over the
  // dark hero and only turns glassy once you scroll past it; elsewhere it just
  // reacts to scroll with the theme colors.
  const isHome = pathname === "/";
  const overHero = isHome && !pastHero;
  const showBar = isHome ? pastHero : scrolled;

  return (
    <header
      className={`${styles.header} ${showBar ? styles.scrolled : ""} ${overHero ? styles.overHero : ""}`}
    >
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
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            type="button"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {session ? (
            <UserMenu name={session.user.name} />
          ) : (
            <button
              className={styles.cta}
              onClick={() => setAuthOpen(true)}
              type="button"
            >
              <Sword size={12} /> Join Now
            </button>
          )}
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
