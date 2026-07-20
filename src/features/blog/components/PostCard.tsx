import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Clock } from "lucide-react";
import { POST_DATE_FORMAT } from "../constants";
import type { PostListItem } from "../types";
import { PostTag } from "./PostTag";
import styles from "./PostCard.module.scss";

export function PostCard({ post }: { post: PostListItem }) {
  const t = useTranslations("Blog");
  const format = useFormatter();

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className={styles.image} />
      </div>
      <div className={styles.body}>
        <div className={styles.tag}>
          <PostTag label={post.tag} accent={post.tagAccent} />
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Clock size={11} /> {t("readTime", { minutes: post.readTimeMinutes })}
          </span>
          <span>
            {format.dateTime(new Date(post.publishedAt), POST_DATE_FORMAT)}
          </span>
        </div>
      </div>
    </Link>
  );
}
