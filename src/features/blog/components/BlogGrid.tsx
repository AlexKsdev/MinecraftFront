import { posts } from "../constants";
import { FeaturedPost } from "./FeaturedPost";
import { PostCard } from "./PostCard";
import styles from "./BlogGrid.module.scss";

export function BlogGrid() {
  const [featured, ...rest] = posts;

  return (
    <div className={styles.wrapper}>
      <FeaturedPost post={featured} />
      <div className={styles.grid}>
        {rest.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
