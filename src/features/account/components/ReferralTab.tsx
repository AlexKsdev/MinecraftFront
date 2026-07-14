import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { REFERRAL_CODE, REFERRAL_FRIENDS, REFERRAL_MILESTONES } from "../constants";
import styles from "../AccountView.module.scss";

export function ReferralTab() {
  const t = useTranslations("Account");
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(`https://purecraft.net/join?ref=${REFERRAL_CODE}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.stack}>
      <div className={styles.heroCard}>
        <span className={styles.heroEmoji}>👥</span>
        <h2 className={styles.heroTitle}>{t("referral.heroTitle")}</h2>
        <p className={styles.muted}>
          {t.rich("referral.heroText", {
            coins: (chunks) => <span className={styles.accentPrimary}>{chunks}</span>,
            key: (chunks) => <span className={styles.accentSky}>{chunks}</span>,
          })}
        </p>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("referral.yourLink")}</h2>
        <div className={styles.linkRow}>
          <div className={styles.linkBox}>purecraft.net/join?ref={REFERRAL_CODE}</div>
          <button className={styles.copyBtn} onClick={copy} type="button">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t("referral.copied") : t("referral.copy")}
          </button>
        </div>
        <p className={styles.muted}>
          {t("referral.yourCode")} <span className={styles.code}>{REFERRAL_CODE}</span>
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.rowBetween}>
          <h2 className={styles.cardTitle}>{t("referral.progress")}</h2>
          <span className={styles.accentPrimary}>{t("referral.friendsCount", { count: 3, total: 5 })}</span>
        </div>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: "60%" }} />
        </div>
        <div className={styles.slotGrid}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`${styles.slot} ${n <= 3 ? styles.slotActive : ""}`}>
              {n <= 3 ? <Check size={14} /> : null}
              <span className={styles.slotLabel}>{t("referral.friends", { count: n })}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("referral.referredFriends")}</h2>
        <ul className={styles.friendList}>
          {REFERRAL_FRIENDS.map((f) => (
            <li key={f.name} className={styles.friendItem}>
              <Image src={f.avatar} alt={f.name} width={32} height={32} className={styles.friendAvatar} unoptimized />
              <div className={styles.friendMeta}>
                <p className={styles.friendName}>{f.name}</p>
                <p className={styles.muted}>{t("referral.joinedAgo", { when: f.joined })}</p>
              </div>
              <span className={styles.accentAmber}>{t("referral.plusCoins", { count: f.reward })}</span>
            </li>
          ))}
        </ul>
        <div className={styles.totalRow}>
          <span className={styles.muted}>{t("referral.totalEarned")}</span>
          <span className={styles.accentAmber}>{t("referral.totalCoins", { count: REFERRAL_FRIENDS.length * 200 })}</span>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("referral.milestones")}</h2>
        <ul className={styles.milestoneList}>
          {REFERRAL_MILESTONES.map((m) => (
            <li key={m.target} className={`${styles.milestoneItem} ${m.done ? "" : styles.dim}`}>
              <span className={`${styles.milestoneBadge} ${m.done ? styles.milestoneDone : ""}`}>
                {m.done ? <Check size={12} /> : m.target}
              </span>
              <span className={styles.milestoneText}>{t("referral.milestoneText", { count: m.target })}</span>
              <span className={styles.accentAmber}>{m.reward}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
