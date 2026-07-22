import { getLocale, getTranslations } from "next-intl/server";
import { fetchWiki } from "./api";
import { WikiHeader } from "./components/WikiHeader";
import { WikiBrowser } from "./components/WikiBrowser";
import type { PostLocale } from "@/features/blog/types";
import styles from "./WikiListView.module.scss";

/**
 * Search lives in the URL rather than component state: the query runs on the
 * server, so it has to reach a request. It also makes a search shareable and
 * survivable across a reload.
 */
export async function WikiListView({ q }: { q?: string }) {
  const locale = (await getLocale()) as PostLocale;
  const [categories, t] = await Promise.all([
    fetchWiki(locale, q),
    getTranslations("Wiki"),
  ]);

  return (
    <div className={styles.page}>
      <WikiHeader initialSearch={q ?? ""} />
      {categories.length > 0 ? (
        <WikiBrowser categories={categories} />
      ) : (
        <p className={styles.empty}>{q ? t("noResults", { q }) : t("empty")}</p>
      )}
    </div>
  );
}
