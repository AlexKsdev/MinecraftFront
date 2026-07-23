import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Clock, User } from "lucide-react";
import { POST_DATE_FORMAT } from "../constants";
import type { PostListItem } from "../types";
import { PostTag } from "./PostTag";
import styles from "./FeaturedPost.module.scss";

export function FeaturedPost({ post }: { post: PostListItem }) {
  const t = useTranslations("Blog");
  const format = useFormatter();

  return (
    <Link href={`/blog/${post.slug}`} className={styles.post}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className={styles.image} />
      </div>
      <div className={styles.body}>
        <div className={styles.tag}>
          <PostTag label={post.tag} accent={post.tagAccent} />
        </div>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <User size={12} /> {post.author}
          </span>
          <span className={styles.metaItem}>
            <Clock size={12} /> {t("readTime", { minutes: post.readTimeMinutes })}
          </span>
          <span>{format.dateTime(new Date(post.publishedAt), POST_DATE_FORMAT)}</span>
        </div>
        <span className={styles.readMore}>
          {t("readMore")} <ChevronRight size={12} />
        </span>
      </div>
    </Link>
  );
}
