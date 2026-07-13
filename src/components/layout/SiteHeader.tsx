"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, Moon, Sun, Sword, X } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { UserMenu } from "./UserMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { AuthModal } from "@/components/AuthModal/AuthModal";
import { OPEN_AUTH_EVENT } from "@/lib/auth/api";
import { useSession } from "@/lib/auth/useSession";
import styles from "./SiteHeader.module.scss";

const NAV_KEYS = ["home", "shop", "blog", "wiki"] as const;
const NAV_HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  home: "/",
  shop: "/shop",
  blog: "/blog",
  wiki: "/wiki",
};

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
  const t = useTranslations("Header");

  const navLinks = NAV_KEYS.map((key) => ({
    href: NAV_HREFS[key],
    label: t(`nav.${key}`),
  }));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any component (e.g. a Buy click while logged out) can request the modal.
  useEffect(() => {
    const open = () => setAuthOpen(true);
    window.addEventListener(OPEN_AUTH_EVENT, open);
    return () => window.removeEventListener(OPEN_AUTH_EVENT, open);
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
          {navLinks.map((link) => (
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
          <LocaleSwitcher overHero={overHero} />
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={t("toggleTheme")}
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
              <Sword size={12} /> {t("joinNow")}
            </button>
          )}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t("toggleMenu")}
            type="button"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <MobileNav
          links={navLinks}
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
