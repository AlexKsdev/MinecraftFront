import { useFormatter, useTranslations } from "next-intl";
import Markdown from "react-markdown";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock, User } from "lucide-react";
import { POST_DATE_FORMAT } from "../constants";
import type { PostDetail as Post } from "../types";
import { PostTag } from "./PostTag";
import styles from "./PostDetail.module.scss";

export function PostDetail({ post }: { post: Post }) {
  const t = useTranslations("Blog");
  const format = useFormatter();

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={14} /> {t("backToBlog")}
        </Link>

        <div className={styles.tag}>
          <PostTag label={post.tag} accent={post.tagAccent} />
        </div>

        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <User size={13} /> {post.author}
          </span>
          <span className={styles.metaItem}>
            <Clock size={13} /> {t("readTime", { minutes: post.readTimeMinutes })}
          </span>
          <span>{format.dateTime(new Date(post.publishedAt), POST_DATE_FORMAT)}</span>
        </div>

        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className={styles.image} />
        </div>

        {/*
          react-markdown renders raw HTML only if rehype-raw is added, and it is
          deliberately not. Admin-authored markdown therefore cannot inject
          markup — which is the whole reason the body is markdown and not HTML.
        */}
        <div className={styles.body}>
          <Markdown>{post.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
