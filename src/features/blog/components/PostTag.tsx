import type { TagAccent } from "../types";
import styles from "./PostTag.module.scss";

export function PostTag({ label, accent }: { label: string; accent: TagAccent }) {
  return <span className={`${styles.tag} ${styles[accent]}`}>{label}</span>;
}
