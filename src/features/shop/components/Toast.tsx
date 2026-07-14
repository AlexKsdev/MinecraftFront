import { AlertCircle, Coins } from "lucide-react";
import type { Toast as ToastData } from "../types";
import styles from "./ShopBrowser.module.scss";

export function Toast({ toast }: { toast: ToastData }) {
  return (
    <div
      className={`${styles.toast} ${toast.ok ? "" : styles.toastError}`}
      role="status"
    >
      {toast.ok ? (
        <Coins size={16} className={styles.toastIcon} />
      ) : (
        <AlertCircle size={16} className={styles.toastIconError} />
      )}
      <span>{toast.text}</span>
    </div>
  );
}
