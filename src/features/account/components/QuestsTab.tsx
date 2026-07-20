"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { claimQuest, getQuests, type Quest } from "@/lib/account/quests";
import { publishBalances } from "@/lib/account/balances";
import {
  BUILT_IN_QUEST_KEYS,
  QUEST_FALLBACK_ICON,
  QUEST_ICON_MAP,
} from "../constants";
import styles from "../AccountView.module.scss";

function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

export function QuestsTab() {
  const t = useTranslations("Account");
  const [quests, setQuests] = useState<Quest[] | null>(null);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [claiming, setClaiming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The reset instant we've already refetched for, so the crossing fires once.
  const reloadedFor = useRef<string | null>(null);

  const load = useCallback(() => {
    return getQuests()
      .then((d) => {
        setQuests(d.quests);
        setResetAt(d.resetAt);
      })
      .catch(() => setError(t("quests.loadFailed")));
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  // Drive the countdown once a second.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // When the clock crosses the reset, pull the fresh set — once per reset.
  useEffect(() => {
    if (
      resetAt &&
      now >= new Date(resetAt).getTime() &&
      reloadedFor.current !== resetAt
    ) {
      reloadedFor.current = resetAt;
      void load();
    }
  }, [now, resetAt, load]);

  async function onClaim(key: string) {
    setClaiming(key);
    setError(null);
    try {
      const res = await claimQuest(key);
      // Bump the header balance immediately, and mark the quest claimed.
      publishBalances({ coins: res.coins, gems: res.gems });
      setQuests(
        (qs) => qs?.map((q) => (q.key === key ? { ...q, claimed: true } : q)) ?? null,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : t("quests.claimFailed"));
    } finally {
      setClaiming(null);
    }
  }

  if (!quests) {
    return (
      <div className={styles.stack}>
        <p className={styles.muted}>{error ?? t("quests.loading")}</p>
      </div>
    );
  }

  const done = quests.filter((q) => q.completed).length;
  const countdown = resetAt
    ? formatCountdown(new Date(resetAt).getTime() - now)
    : "—";

  return (
    <div className={styles.stack}>
      <div className={styles.rowBetween}>
        <p className={styles.muted}>
          {t("quests.resetIn")}{" "}
          <span className={styles.accentPrimary}>{countdown}</span>
        </p>
        <span className={styles.muted}>
          {t("quests.doneCount", { done, total: quests.length })}
        </span>
      </div>

      {error && <p className={styles.securityError}>{error}</p>}

      {quests.map((q) => {
        const Icon = QUEST_ICON_MAP[q.icon] ?? QUEST_FALLBACK_ICON;
        // Built-in quests have translated titles; admin-added ones use the
        // title stored on the row.
        const title = BUILT_IN_QUEST_KEYS.has(q.key)
          ? t(`quests.items.${q.key}`)
          : q.title;
        const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
        const reward =
          q.reward.type === "GEMS"
            ? t("quests.rewardGems", { amount: q.reward.amount })
            : t("quests.rewardCoins", { amount: q.reward.amount });
        return (
          <div
            key={q.key}
            className={`${styles.card} ${q.completed ? styles.achieveDone : ""} ${q.claimed ? styles.questClaimed : ""}`}
          >
            <div className={styles.questRow}>
              <span
                className={styles.achieveIcon}
                style={{ color: q.completed ? "var(--primary)" : q.color }}
              >
                <Icon size={18} />
              </span>
              <div className={styles.questMeta}>
                <div className={styles.rowBetween}>
                  <p className={styles.questTitle}>{title}</p>
                  <span className={styles.accentAmber}>{reward}</span>
                </div>
                <p className={styles.muted}>
                  {q.progress} / {q.target}
                </p>
              </div>
            </div>
            <div className={styles.track}>
              <div
                className={q.completed ? styles.trackFill : styles.trackFillSoft}
                style={{ width: `${pct}%` }}
              />
            </div>
            {q.completed && (
              <button
                className={`${styles.primaryBtn} ${q.claimed ? styles.claimedBtn : ""}`}
                type="button"
                disabled={q.claimed || claiming === q.key}
                onClick={() => void onClaim(q.key)}
              >
                {q.claimed
                  ? t("quests.claimed")
                  : claiming === q.key
                    ? t("quests.claiming")
                    : t("quests.claim")}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
