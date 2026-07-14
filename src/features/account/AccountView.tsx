"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import {
  Coins, Gem, Check, Copy, Clock, Sword, Map, TrendingUp,
} from "lucide-react";
import {
  getProfile, avatarUrl, formatPlaytime, formatBlocks, formatJoinDate,
  UnauthorizedError, type Profile,
} from "@/lib/account/api";
import {
  TABS, RECENT_ACTIVITY, PERKS, DAILY_BONUSES, COIN_REWARDS,
  REFERRAL_CODE, REFERRAL_FRIENDS, REFERRAL_MILESTONES, ACHIEVEMENTS, QUESTS,
  type TabId,
} from "./constants";
import styles from "./AccountView.module.scss";

function buildStats(p: Profile) {
  return [
    { id: "playtime", value: formatPlaytime(p.playtimeMinutes), icon: Clock, accent: "var(--primary)" },
    { id: "kills", value: String(p.kills), icon: Sword, accent: "#f87171" },
    { id: "blocks", value: formatBlocks(p.blocksPlaced), icon: Map, accent: "#fbbf24" },
    { id: "kd", value: p.deaths ? (p.kills / p.deaths).toFixed(2) : String(p.kills), icon: TrendingUp, accent: "#38bdf8" },
  ];
}

function XpBar({ player }: { player: Profile }) {
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

function OverviewTab({ player }: { player: Profile }) {
  const t = useTranslations("Account");
  return (
    <div className={styles.stack}>
      <section className={styles.statsGrid}>
        {buildStats(player).map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className={styles.statCard}>
              <span className={styles.statIcon} style={{ color: stat.accent }}>
                <Icon size={18} />
              </span>
              <div>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{t(`stats.${stat.id}`)}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("overview.recentActivity")}</h2>
        <ul className={styles.activityList}>
          {RECENT_ACTIVITY.map((item) => (
            <li key={item.action} className={styles.activityItem}>
              <span className={styles.dot} style={{ background: item.color }} />
              <span className={styles.activityAction}>{item.action}</span>
              <span className={styles.muted}>{item.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>{t("overview.activePerks")}</h2>
        <div className={styles.perks}>
          {PERKS.map((perk) => (
            <span key={perk} className={styles.perk}>{perk}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function BonusesTab({ player }: { player: Profile }) {
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

function ReferralTab() {
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

function AchievementsTab() {
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

function QuestsTab() {
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

export function AccountView() {
  const t = useTranslations("Account");
  const [tab, setTab] = useState<TabId>("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    getProfile()
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof UnauthorizedError) {
          router.replace("/");
          return;
        }
        setError(err instanceof Error ? err.message : t("errorGeneric"));
      });
    return () => {
      active = false;
    };
  }, [router, t]);

  if (error || !profile) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <section className={styles.card}>
            <p className={styles.muted}>{error ?? t("loading")}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Profile header */}
        <section className={styles.profile}>
          <div className={styles.avatarWrap}>
            <Image src={avatarUrl(profile)} alt={profile.name} width={80} height={80} className={styles.avatar} unoptimized />
            <span className={styles.rankBadge}>{profile.rank}</span>
          </div>
          <div className={styles.identity}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{profile.name}</h1>
              <span className={styles.online}><span className={styles.onlineDot} />{t("online")}</span>
            </div>
            <p className={styles.meta}>{profile.email} · {t("joined", { date: formatJoinDate(profile.createdAt) })}</p>
            <XpBar player={profile} />
          </div>
          <div className={styles.currency}>
            <span className={`${styles.coin} ${styles.coinAmber}`}><Coins size={14} />{profile.coins.toLocaleString("en-US")}</span>
            <span className={`${styles.coin} ${styles.coinPurple}`}><Gem size={14} />{profile.gems}</span>
          </div>
        </section>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tabItem) => {
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.id}
                className={`${styles.tab} ${tab === tabItem.id ? styles.tabActive : ""}`}
                onClick={() => setTab(tabItem.id)}
                type="button"
              >
                <Icon size={13} />
                {t(`tabs.${tabItem.id}`)}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "overview" && <OverviewTab player={profile} />}
        {tab === "bonuses" && <BonusesTab player={profile} />}
        {tab === "referral" && <ReferralTab />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "quests" && <QuestsTab />}
      </div>
    </div>
  );
}
