import { BlogHeader } from "./components/BlogHeader";
import { BlogGrid } from "./components/BlogGrid";
import styles from "./BlogListView.module.scss";

export function BlogListView() {
  return (
    <div className={styles.page}>
      <BlogHeader />
      <BlogGrid />
    </div>
  );
}
