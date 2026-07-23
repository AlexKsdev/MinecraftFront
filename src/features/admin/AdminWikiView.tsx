import { getTranslations } from "next-intl/server";
import { serverFetch } from "@/lib/server/api";
import type { AdminWikiCategory } from "@/lib/admin/api";
import { WikiCategoryCreate } from "./WikiCategoryCreate";
import { WikiCategoryRow } from "./WikiCategoryRow";
import styles from "./AdminUsers.module.scss";

/**
 * A Server Component, like the blog table. Reads /wiki/manage rather than
 * /wiki — drafts have to be findable to be finished, and a category with no
 * articles has to be visible to put the first one in it.
 */
export async function AdminWikiView() {
  const [t, res] = await Promise.all([
    getTranslations("Admin"),
    serverFetch("/wiki/manage"),
  ]);

  if (!res.ok) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.empty}>{t("loadFailed")}</p>
        </div>
      </div>
    );
  }

  const categories = (await res.json()) as AdminWikiCategory[];
  const articleCount = categories.reduce(
    (n, category) => n + category.articles.length,
    0,
  );

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("wiki.title")}</h1>
        <p className={styles.subtitle}>
          {t("wiki.count", {
            categories: categories.length,
            articles: articleCount,
          })}
        </p>

        <WikiCategoryCreate />

        {categories.length === 0 ? (
          <p className={styles.empty}>{t("wiki.noCategories")}</p>
        ) : (
          categories.map((category) => (
            <WikiCategoryRow
              key={category.id}
              category={category}
              categories={categories}
            />
          ))
        )}
      </div>
    </div>
  );
}
