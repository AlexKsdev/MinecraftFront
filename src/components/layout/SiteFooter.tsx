import Link from "next/link";
import { SERVER_IP } from "@/constants";
import styles from "./SiteFooter.module.scss";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
];

const communityLinks = [
  { href: "/account", label: "Account" },
  { href: "/wiki", label: "Rules" },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <span className={styles.brand}>
              Minecraft<span className={styles.brandAccent}>Front</span>
            </span>
            <p className={styles.tagline}>
              The ultimate Minecraft survival experience. Build, explore, and
              conquer with friends.
            </p>
            <span className={styles.ipBadge}>
              <span className={styles.ipDot} />
              {SERVER_IP}
            </span>
          </div>

          <div>
            <h4 className={styles.heading}>Navigation</h4>
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
            <h4 className={styles.heading}>Community</h4>
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
          <span>© 2026 MinecraftFront. Not affiliated with Mojang.</span>
          <span>Made with ♥ for the community</span>
        </div>
      </div>
    </footer>
  );
}
