import { useTranslations } from "next-intl";
import { Clock, Sword, Map, TrendingUp } from "lucide-react";
import { formatPlaytime, formatBlocks, type Profile } from "@/lib/account/api";
import { RECENT_ACTIVITY, PERKS } from "../constants";
import styles from "../AccountView.module.scss";

function buildStats(p: Profile) {
  return [
    { id: "playtime", value: formatPlaytime(p.playtimeMinutes), icon: Clock, accent: "var(--primary)" },
    { id: "kills", value: String(p.kills), icon: Sword, accent: "#f87171" },
    { id: "blocks", value: formatBlocks(p.blocksPlaced), icon: Map, accent: "#fbbf24" },
    { id: "kd", value: p.deaths ? (p.kills / p.deaths).toFixed(2) : String(p.kills), icon: TrendingUp, accent: "#38bdf8" },
  ];
}

export function OverviewTab({ player }: { player: Profile }) {
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
