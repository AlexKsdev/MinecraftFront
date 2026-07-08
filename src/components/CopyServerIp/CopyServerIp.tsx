"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./CopyServerIp.module.scss";

export function CopyServerIp({ serverIp }: { serverIp: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (permissions, insecure context); leave the button as-is.
    }
  };

  return (
    <button className={styles.button} onClick={handleCopy} type="button">
      <span className={styles.ip}>{serverIp}</span>
      <span className={`${styles.status} ${copied ? styles.copied : ""}`}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </span>
    </button>
  );
}
