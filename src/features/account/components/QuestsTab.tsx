import { useTranslations } from "next-intl";
import { QUESTS } from "../constants";
import styles from "../AccountView.module.scss";

export function QuestsTab() {
  const t = useTranslations("Account");
  const done = QUESTS.filter((q) => q.progress >= q.total).length;
  return (
    <div className={styles.stack}>
      <div className={styles.rowBetween}>
        <p className={styles.muted}>
          {t.rich("quests.resetIn", {
            time: (chunks) => <span className={styles.accentPrimary}>{chunks}</span>,
          })}
        </p>
        <span className={styles.muted}>{t("quests.doneCount", { done, total: QUESTS.length })}</span>
      </div>
      {QUESTS.map((q) => {
        const Icon = q.icon;
        const isDone = q.progress >= q.total;
        const pct = Math.min(100, Math.round((q.progress / q.total) * 100));
        return (
          <div key={q.title} className={`${styles.card} ${isDone ? styles.achieveDone : ""}`}>
            <div className={styles.questRow}>
              <span className={styles.achieveIcon} style={{ color: isDone ? "var(--primary)" : q.color }}>
                <Icon size={18} />
              </span>
              <div className={styles.questMeta}>
                <div className={styles.rowBetween}>
                  <p className={styles.questTitle}>{q.title}</p>
                  <span className={styles.accentAmber}>{q.reward}</span>
                </div>
                <p className={styles.muted}>{q.progress} / {q.total}</p>
              </div>
            </div>
            <div className={styles.track}>
              <div className={isDone ? styles.trackFill : styles.trackFillSoft} style={{ width: `${pct}%` }} />
            </div>
            {isDone && <button className={styles.primaryBtn} type="button">{t("quests.claim")}</button>}
          </div>
        );
      })}
    </div>
  );
}
