"use client";

import { useState } from "react";
import Image from "next/image";
import { Coins, Gem, Check, Copy } from "lucide-react";
import {
  PLAYER, TABS, STATS, RECENT_ACTIVITY, PERKS, DAILY_BONUSES, COIN_REWARDS,
  REFERRAL_CODE, REFERRAL_FRIENDS, REFERRAL_MILESTONES, ACHIEVEMENTS, QUESTS,
  type TabId,
} from "./constants";
import styles from "./AccountView.module.scss";

function XpBar() {
  const pct = Math.round((PLAYER.xp / PLAYER.xpNext) * 100);
  return (
    <div className={styles.xp}>
      <div className={styles.xpTop}>
        <span>Level {PLAYER.level}</span>
        <span>
          {PLAYER.xp.toLocaleString("en-US")} / {PLAYER.xpNext.toLocaleString("en-US")} XP
        </span>
      </div>
      <div className={styles.track}>
        <div className={styles.trackFill} style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.xpHint}>
        {pct}% to Level {PLAYER.level + 1}
      </p>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className={styles.stack}>
      <section className={styles.statsGrid}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <span className={styles.statIcon} style={{ color: stat.accent }}>
                <Icon size={18} />
              </span>
              <div>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Experience</h2>
        <XpBar />
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Recent Activity</h2>
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
        <h2 className={styles.cardTitle}>Active Perks</h2>
        <div className={styles.perks}>
          {PERKS.map((perk) => (
            <span key={perk} className={styles.perk}>{perk}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

function BonusesTab() {
  const [claimed, setClaimed] = useState(false);
  return (
    <div className={styles.stack}>
      <div className={styles.streakBanner}>
        <span className={styles.streakEmoji}>🔥</span>
        <div>
          <p className={styles.streakTitle}>{PLAYER.streak} Day Streak!</p>
          <p className={styles.muted}>Log in tomorrow to keep your streak and claim Day 8 reward.</p>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.rowBetween}>
          <h2 className={styles.cardTitle}>Daily Login Rewards</h2>
          <span className={styles.muted}>Day {PLAYER.streak} / 14</span>
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
                {b.today && <span className={styles.todayTag}>TODAY</span>}
                <span className={styles.dayLabel}>Day {b.day}</span>
                <Icon size={14} style={{ color: b.color }} />
                <span className={styles.dayReward}>{b.reward}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.claimWrap}>
          {!claimed ? (
            <button className={styles.primaryBtn} onClick={() => setClaimed(true)} type="button">
              🎁 Claim Day 7 — Legend Crate
            </button>
          ) : (
            <div className={styles.claimedNote}>
              <Check size={14} /> Claimed! Come back tomorrow
            </div>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Coin Rewards</h2>
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
        <h2 className={styles.heroTitle}>Invite Friends, Earn Rewards</h2>
        <p className={styles.muted}>
          For every friend who joins with your link, you both get{" "}
          <span className={styles.accentPrimary}>200 Coins</span> + a{" "}
          <span className={styles.accentSky}>Rare Key</span>.
        </p>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Your Referral Link</h2>
        <div className={styles.linkRow}>
          <div className={styles.linkBox}>purecraft.net/join?ref={REFERRAL_CODE}</div>
          <button className={styles.copyBtn} onClick={copy} type="button">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className={styles.muted}>
          Your code: <span className={styles.code}>{REFERRAL_CODE}</span>
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.rowBetween}>
          <h2 className={styles.cardTitle}>Referral Progress</h2>
          <span className={styles.accentPrimary}>3 / 5 friends</span>
        </div>
        <div className={styles.track}>
          <div className={styles.trackFill} style={{ width: "60%" }} />
        </div>
        <div className={styles.slotGrid}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`${styles.slot} ${n <= 3 ? styles.slotActive : ""}`}>
              {n <= 3 ? <Check size={14} /> : null}
              <span className={styles.slotLabel}>{n} friend{n > 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Referred Friends</h2>
        <ul className={styles.friendList}>
          {REFERRAL_FRIENDS.map((f) => (
            <li key={f.name} className={styles.friendItem}>
              <Image src={f.avatar} alt={f.name} width={32} height={32} className={styles.friendAvatar} unoptimized />
              <div className={styles.friendMeta}>
                <p className={styles.friendName}>{f.name}</p>
                <p className={styles.muted}>Joined {f.joined}</p>
              </div>
              <span className={styles.accentAmber}>+{f.reward} coins</span>
            </li>
          ))}
        </ul>
        <div className={styles.totalRow}>
          <span className={styles.muted}>Total earned from referrals</span>
          <span className={styles.accentAmber}>{REFERRAL_FRIENDS.length * 200} Coins</span>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Referral Milestones</h2>
        <ul className={styles.milestoneList}>
          {REFERRAL_MILESTONES.map((m) => (
            <li key={m.target} className={`${styles.milestoneItem} ${m.done ? "" : styles.dim}`}>
              <span className={`${styles.milestoneBadge} ${m.done ? styles.milestoneDone : ""}`}>
                {m.done ? <Check size={12} /> : m.target}
              </span>
              <span className={styles.milestoneText}>{m.target} friends invited</span>
              <span className={styles.accentAmber}>{m.reward}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AchievementsTab() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.done).length;
  return (
    <div className={styles.stack}>
      <p className={styles.muted}>{unlocked} / {ACHIEVEMENTS.length} unlocked</p>
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
  const done = QUESTS.filter((q) => q.progress >= q.total).length;
  return (
    <div className={styles.stack}>
      <div className={styles.rowBetween}>
        <p className={styles.muted}>Daily quests reset in <span className={styles.accentPrimary}>08:24:11</span></p>
        <span className={styles.muted}>{done}/{QUESTS.length} done</span>
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
            {isDone && <button className={styles.primaryBtn} type="button">Claim Reward</button>}
          </div>
        );
      })}
    </div>
  );
}

export function AccountView() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Profile header */}
        <section className={styles.profile}>
          <div className={styles.avatarWrap}>
            <Image src={PLAYER.avatar} alt={PLAYER.name} width={80} height={80} className={styles.avatar} unoptimized />
            <span className={styles.rankBadge}>{PLAYER.rank}</span>
          </div>
          <div className={styles.identity}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{PLAYER.name}</h1>
              <span className={styles.online}><span className={styles.onlineDot} />Online</span>
            </div>
            <p className={styles.meta}>{PLAYER.email} · Joined {PLAYER.joinDate}</p>
            <XpBar />
          </div>
          <div className={styles.currency}>
            <span className={`${styles.coin} ${styles.coinAmber}`}><Coins size={14} />{PLAYER.coins.toLocaleString("en-US")}</span>
            <span className={`${styles.coin} ${styles.coinPurple}`}><Gem size={14} />{PLAYER.gems}</span>
          </div>
        </section>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
                onClick={() => setTab(t.id)}
                type="button"
              >
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "overview" && <OverviewTab />}
        {tab === "bonuses" && <BonusesTab />}
        {tab === "referral" && <ReferralTab />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "quests" && <QuestsTab />}
      </div>
    </div>
  );
}
