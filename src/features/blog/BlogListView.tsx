import { getLocale, getTranslations } from "next-intl/server";
import { fetchPosts } from "./api";
import { BlogHeader } from "./components/BlogHeader";
import { BlogGrid } from "./components/BlogGrid";
import type { PostLocale } from "./types";
import styles from "./BlogListView.module.scss";

export async function BlogListView() {
  const locale = (await getLocale()) as PostLocale;
  const [posts, t] = await Promise.all([
    fetchPosts(locale),
    getTranslations("Blog"),
  ]);

  return (
    <div className={styles.page}>
      <BlogHeader />
      {posts.length > 0 ? (
        <BlogGrid posts={posts} />
      ) : (
        <p className={styles.empty}>{t("empty")}</p>
      )}
    </div>
  );
}
