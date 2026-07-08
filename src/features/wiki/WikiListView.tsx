import { WikiBrowser } from "./components/WikiBrowser";
import styles from "./WikiListView.module.scss";

export function WikiListView() {
  return (
    <div className={styles.page}>
      <WikiBrowser />
    </div>
  );
}
