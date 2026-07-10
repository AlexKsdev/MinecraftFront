import { BookOpen } from "lucide-react";
import styles from "./BlogHeader.module.scss";

export function BlogHeader() {
  return (
    <div className={styles.header}>
      <BookOpen size={32} className={styles.icon} />
      <h1 className={styles.title}>Blog</h1>
      <p className={styles.subtitle}>
        Updates, events, guides, and community news.
      </p>
    </div>
  );
}
