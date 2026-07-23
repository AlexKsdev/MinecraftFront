"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookMarked, Search } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import styles from "./WikiHeader.module.scss";

/** Long enough that typing a word is one query, short enough to feel live. */
const DEBOUNCE_MS = 300;

export function WikiHeader({ initialSearch }: { initialSearch: string }) {
  const t = useTranslations("Wiki");
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);

  // The query runs on the server, so the input drives the URL rather than
  // local state — debounced, or every keystroke would be a round trip.
  useEffect(() => {
    if (search.trim() === initialSearch) return;

    const timer = setTimeout(() => {
      const query = search.trim();
      router.replace(
        query ? `${pathname}?q=${encodeURIComponent(query)}` : pathname,
      );
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, initialSearch, pathname, router]);

  return (
    <div className={styles.header}>
      <BookMarked size={32} className={styles.icon} />
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label={t("searchPlaceholder")}
        />
      </div>
    </div>
  );
}
