import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import type { BlogPost } from "../constants";
import { PostTag } from "./PostTag";
import styles from "./PostDetail.module.scss";

export function PostDetail({ post }: { post: BlogPost }) {
  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to Blog
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
            <Clock size={13} /> {post.readTime}
          </span>
          <span>{post.date}</span>
        </div>

        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} className={styles.image} />
        </div>

        <p className={styles.body}>{post.excerpt}</p>
      </div>
    </div>
  );
}
