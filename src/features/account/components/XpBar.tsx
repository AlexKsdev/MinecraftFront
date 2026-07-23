import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/account/api";
import styles from "../AccountView.module.scss";

export function XpBar({ player }: { player: Profile }) {
  const t = useTranslations("Account");
  const pct = Math.round((player.xp / player.xpNext) * 100);
  return (
    <div className={styles.xp}>
      <div className={styles.xpTop}>
        <span>{t("xp.level", { level: player.level })}</span>
        <span>
          {player.xp.toLocaleString("en-US")} / {player.xpNext.toLocaleString("en-US")} XP
        </span>
      </div>
      <div className={styles.track}>
        <div className={styles.trackFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.xpHint}>
        {t("xp.toNext", { pct, level: player.level + 1 })}
      </p>
    </div>
  );
}
