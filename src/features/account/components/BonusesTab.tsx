import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import type { Profile } from "@/lib/account/api";
import { DAILY_BONUSES, COIN_REWARDS } from "../constants";
import styles from "../AccountView.module.scss";

export function BonusesTab({ player }: { player: Profile }) {
  const t = useTranslations("Account");
  const [claimed, setClaimed] = useState(false);
  return (
    <div className={styles.stack}>
      <div className={styles.streakBanner}>
        <span className={styles.streakEmoji}>🔥</span>
        <div>
          <p className={styles.streakTitle}>{t("bonuses.streak", { days: player.streak })}</p>
          <p className={styles.muted}>{t("bonuses.streakHint")}</p>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.rowBetween}>
          <h2 className={styles.cardTitle}>{t("bonuses.dailyRewards")}</h2>
          <span className={styles.muted}>{t("bonuses.dayCount", { day: player.streak })}</span>
        </div>
        <div className={styles.bonusGrid}>
          {DAILY_BONUSES.map((b) => {
            const Icon = b.icon;
            const cls = [styles.bonusDay, b.today ? styles.bonusToday : b.claimed ? styles.bonusClaimed : ""].join(" ");
            return (
              <div key={b.day} className={cls}>
                {b.claimed && (
                  <span className={styles.bonusCheck}><Check size={14} /></span>
                )}
                {b.today && <span className={styles.todayTag}>{t("bonuses.today")}</span>}
                <span className={styles.dayLabel}>{t("bonuses.day", { day: b.day })}</span>
                <Icon size={14} style={{ color: b.color }} />
                <span className={styles.dayReward}>{b.reward}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.claimWrap}>
          {!claimed ? (
            <button className={styles.primaryBtn} onClick={() => setClaimed(true)} type="button">
              {t("bonuses.claimCta")}
            </button>
          ) : (
            <div className={styles.claimedNote}>
              <Check size={14} /> {t("bonuses.claimedNote")}
            </div>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("bonuses.coinRewards")}</h2>
        <div className={styles.rewardGrid}>
          {COIN_REWARDS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className={styles.rewardCard}>
                <Icon size={18} style={{ color: r.color }} />
                <p className={styles.rewardLabel}>{r.label}</p>
                <p className={styles.rewardDesc}>{r.desc}</p>
                <span className={styles.rewardValue}>{r.reward}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
