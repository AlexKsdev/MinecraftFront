import type { PostListItem } from "../types";
import { FeaturedPost } from "./FeaturedPost";
import { PostCard } from "./PostCard";
import styles from "./BlogGrid.module.scss";

export function BlogGrid({ posts }: { posts: PostListItem[] }) {
  const [featured, ...rest] = posts;

  return (
    <div className={styles.wrapper}>
      <FeaturedPost post={featured} />
      <div className={styles.grid}>
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
