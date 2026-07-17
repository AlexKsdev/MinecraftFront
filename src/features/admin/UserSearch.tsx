"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";
import styles from "./AdminUsers.module.scss";

/**
 * Puts the term in the URL and lets the server re-render the page. Keeping the
 * query there means a filtered view is linkable and survives a reload — and no
 * client-side fetching is needed to show it.
 */
export function UserSearch({ initial }: { initial: string }) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [term, setTerm] = useState(initial);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = term.trim();
    // Back to page 1: the old page number rarely exists under a new filter.
    router.push(
      trimmed
        ? `/admin/users?search=${encodeURIComponent(trimmed)}`
        : "/admin/users",
    );
  }

  return (
    <form className={styles.searchRow} onSubmit={submit} role="search">
      <div className={styles.searchWrap}>
        <Search size={14} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t("users.searchPlaceholder")}
          aria-label={t("users.searchLabel")}
        />
      </div>
      <button className={styles.searchBtn} type="submit">
        {t("users.search")}
      </button>
    </form>
  );
}
