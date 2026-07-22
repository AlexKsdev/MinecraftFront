import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { fetchWikiArticle } from "./api";
import type { PostLocale } from "@/features/blog/types";
import styles from "./WikiArticleView.module.scss";

export async function WikiArticleView({ slug }: { slug: string }) {
  const locale = (await getLocale()) as PostLocale;
  const [article, t] = await Promise.all([
    fetchWikiArticle(slug, locale),
    getTranslations("Wiki"),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <Link href="/wiki" className={styles.backLink}>
          <ArrowLeft size={14} /> {t("backToWiki")}
        </Link>

        <p className={styles.category}>{article.categoryTitle}</p>
        <h1 className={styles.title}>{article.title}</h1>

        {/*
          An article whose body is still just its summary has not been written
          yet — printing the same sentence twice reads as a bug, so the lede is
          dropped until the two actually differ.
        */}
        {article.body.trim() !== article.summary.trim() && (
          <p className={styles.summary}>{article.summary}</p>
        )}

        {/*
          Raw HTML stays disabled — rehype-raw is deliberately not added, so
          authored markdown cannot inject markup. Same rule as the blog.
        */}
        <div className={styles.body}>
          <Markdown>{article.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
