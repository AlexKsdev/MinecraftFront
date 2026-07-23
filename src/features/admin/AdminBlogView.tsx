import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { serverFetch } from "@/lib/server/api";
import type { AdminPost } from "@/lib/admin/api";
import { POST_DATE_FORMAT } from "@/features/blog/constants";
import { CONTENT_LOCALES, localizedTitle } from "./constants";
import { PostCreate } from "./PostCreate";
import { PostRowActions } from "./PostRowActions";
import styles from "./AdminUsers.module.scss";

/**
 * A Server Component, like the quests table. Reads /posts/manage rather than
 * /posts — drafts have to be findable to be finished. The blog is small, so
 * there is no pager.
 */
export async function AdminBlogView() {
  const [t, format, locale, res] = await Promise.all([
    getTranslations("Admin"),
    getFormatter(),
    getLocale(),
    serverFetch("/posts/manage"),
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

  const posts = (await res.json()) as AdminPost[];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("blog.title")}</h1>
        <p className={styles.subtitle}>
          {t("blog.count", { count: posts.length })}
        </p>

        <PostCreate />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("blog.table.post")}</th>
                <th>{t("blog.table.languages")}</th>
                <th>{t("blog.table.published")}</th>
                <th>{t("blog.table.status")}</th>
                <th className={styles.actionsCol}>{t("blog.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const written = CONTENT_LOCALES.filter((locale) =>
                  post.translations.some((tr) => tr.locale === locale),
                );
                return (
                  <tr
                    key={post.id}
                    className={post.published ? "" : styles.dim}
                  >
                    <td>
                      <div>
                        {localizedTitle(post.translations, locale, post.slug)}
                      </div>
                      <div className={styles.mono}>{post.slug}</div>
                    </td>
                    {/* Which languages exist, so a missing translation is
                        visible without opening the post. */}
                    <td className={styles.mono}>{written.join(" / ") || "—"}</td>
                    <td className={styles.mono}>
                      {post.publishedAt
                        ? format.dateTime(
                            new Date(post.publishedAt),
                            POST_DATE_FORMAT,
                          )
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`${styles.role} ${post.published ? styles.roleAdmin : ""}`}
                      >
                        {post.published
                          ? t("blog.published")
                          : t("blog.draft")}
                      </span>
                    </td>
                    <td>
                      <PostRowActions post={post} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
