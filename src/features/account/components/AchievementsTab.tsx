import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { ACHIEVEMENTS } from "../constants";
import styles from "../AccountView.module.scss";

export function AchievementsTab() {
  const t = useTranslations("Account");
  const unlocked = ACHIEVEMENTS.filter((a) => a.done).length;
  return (
    <div className={styles.stack}>
      <p className={styles.muted}>{t("achievements.unlocked", { count: unlocked, total: ACHIEVEMENTS.length })}</p>
      <div className={styles.achieveGrid}>
        {ACHIEVEMENTS.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.title} className={`${styles.achieveCard} ${a.done ? styles.achieveDone : styles.dim}`}>
              <span className={styles.achieveIcon} style={{ color: a.done ? a.color : undefined }}>
                <Icon size={20} />
              </span>
              <div className={styles.achieveBody}>
                <div className={styles.achieveHead}>
                  <p className={styles.achieveTitle}>{a.title}</p>
                  {a.done && <Check size={12} className={styles.accentPrimary} />}
                </div>
                <p className={styles.muted}>{a.desc}</p>
                {!a.done && a.current !== undefined && (
                  <div className={styles.achieveProgress}>
                    <div className={styles.rowBetween}>
                      <span className={styles.tiny}>{a.current} / {a.total}</span>
                      <span className={styles.tiny}>{a.progress}%</span>
                    </div>
                    <div className={styles.trackThin}>
                      <div className={styles.trackFillSoft} style={{ width: `${a.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
