"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./LocaleSwitcher.module.scss";

const LABELS: Record<string, string> = { en: "EN", uk: "UK" };

export function LocaleSwitcher({ overHero = false }: { overHero?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`${styles.switcher} ${overHero ? styles.overHero : ""}`}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          className={`${styles.option} ${code === locale ? styles.active : ""}`}
          onClick={() => router.replace(pathname, { locale: code })}
          aria-current={code === locale}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}
