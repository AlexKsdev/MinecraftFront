import { getTranslations } from "next-intl/server";
import { serverFetch } from "@/lib/server/api";
import type { AdminQuest } from "@/lib/admin/api";
import { QuestCreate } from "./QuestCreate";
import { QuestRowActions } from "./QuestRowActions";
import styles from "./AdminUsers.module.scss";

/**
 * A Server Component, like the products table. Reads /quests/manage rather than
 * /quests — the admin has to see what they deactivated in order to put it back.
 * The catalogue is small, so there is no pager.
 */
export async function AdminQuestsView() {
  const t = await getTranslations("Admin");
  const res = await serverFetch("/quests/manage");

  if (!res.ok) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.empty}>{t("loadFailed")}</p>
        </div>
      </div>
    );
  }

  const quests = (await res.json()) as AdminQuest[];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("quests.title")}</h1>
        <p className={styles.subtitle}>
          {t("quests.count", { count: quests.length })}
        </p>

        <QuestCreate />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("quests.table.quest")}</th>
                <th>{t("quests.table.target")}</th>
                <th>{t("quests.table.reward")}</th>
                <th>{t("quests.table.status")}</th>
                <th className={styles.actionsCol}>
                  {t("quests.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {quests.map((quest) => (
                <tr key={quest.id} className={quest.active ? "" : styles.dim}>
                  <td>
                    <div>{quest.title}</div>
                    <div className={styles.mono}>{quest.key}</div>
                  </td>
                  <td className={styles.mono}>{quest.target}</td>
                  <td className={styles.mono}>
                    {quest.rewardAmount.toLocaleString("en-US")}{" "}
                    {quest.rewardType === "GEMS"
                      ? t("products.gems")
                      : t("products.coins")}
                  </td>
                  <td>
                    <span
                      className={`${styles.role} ${quest.active ? styles.roleAdmin : ""}`}
                    >
                      {quest.active
                        ? t("quests.active")
                        : t("quests.inactive")}
                    </span>
                  </td>
                  <td>
                    <QuestRowActions quest={quest} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
