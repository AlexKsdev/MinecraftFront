"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Coins, Gem } from "lucide-react";
import { avatarUrl, formatJoinDate } from "@/lib/account/api";
import { useBalances } from "@/lib/account/balances";
import { TABS, type TabId } from "./constants";
import { useProfile } from "./hooks/useProfile";
import { XpBar } from "./components/XpBar";
import { OverviewTab } from "./components/OverviewTab";
import { BonusesTab } from "./components/BonusesTab";
import { ReferralTab } from "./components/ReferralTab";
import { AchievementsTab } from "./components/AchievementsTab";
import { QuestsTab } from "./components/QuestsTab";
import { SecurityTab } from "./components/SecurityTab";
import styles from "./AccountView.module.scss";

export function AccountView() {
  const t = useTranslations("Account");
  const [tab, setTab] = useState<TabId>("overview");
  const { profile, error } = useProfile();
  // Live balances (updated on quest claim / purchase) so the pinned card
  // doesn't show a stale total while it stays on screen.
  const balances = useBalances();

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
        {/* Profile header + tabs: pinned under the site header while scrolling. */}
        <div className={styles.stickyHead}>
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
              <span className={`${styles.coin} ${styles.coinAmber}`}><Coins size={14} />{(balances?.coins ?? profile.coins).toLocaleString("en-US")}</span>
              <span className={`${styles.coin} ${styles.coinPurple}`}><Gem size={14} />{balances?.gems ?? profile.gems}</span>
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
        </div>

        {/* Tab content */}
        {tab === "overview" && <OverviewTab player={profile} />}
        {tab === "bonuses" && <BonusesTab player={profile} />}
        {tab === "referral" && <ReferralTab />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "quests" && <QuestsTab />}
        {tab === "security" && <SecurityTab player={profile} />}
      </div>
    </div>
  );
}
