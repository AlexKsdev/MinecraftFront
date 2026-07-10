import { ShopHeader } from "./components/ShopHeader";
import { ShopBrowser } from "./components/ShopBrowser";
import styles from "./ShopListView.module.scss";

export function ShopListView() {
  return (
    <div className={styles.page}>
      <ShopHeader />
      <ShopBrowser />
    </div>
  );
}
