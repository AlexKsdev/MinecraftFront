import { Link } from "@/i18n/navigation";
import { Clock } from "lucide-react";
import type { BlogPost } from "../constants";
import { PostTag } from "./PostTag";
import styles from "./PostCard.module.scss";

export function PostCard({ post }: { post: BlogPost }) {
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
            <Clock size={11} /> {post.readTime}
          </span>
          <span>{post.date}</span>
        </div>
      </div>
    </Link>
  );
}
