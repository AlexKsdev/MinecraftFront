"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  activateQuest,
  deactivateQuest,
  updateQuest,
  type AdminQuest,
} from "@/lib/admin/api";
import { QuestForm } from "./QuestForm";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";

/**
 * Edit, and take out of / put back into the daily set. Removal is a
 * deactivation server side — claims reference a quest by key and must keep
 * meaning something — so it is offered as a reversible pair, not a delete.
 */
export function QuestRowActions({ quest }: { quest: AdminQuest }) {
  const t = useTranslations("Admin");
  const [editing, setEditing] = useState(false);
  const action = useStepUpAction(() => setEditing(false));

  if (action.awaitingPassword) return <StepUpPrompt action={action} />;

  if (editing) {
    return (
      <QuestForm
        initial={quest}
        busy={action.busy}
        error={action.error}
        submitLabel={t("quests.save")}
        onCancel={() => setEditing(false)}
        onSubmit={(input) => action.run(() => updateQuest(quest.id, input))}
      />
    );
  }

  return (
    <div className={styles.actions}>
      <button
        className={styles.actionBtn}
        type="button"
        onClick={() => setEditing(true)}
      >
        {t("quests.edit")}
      </button>
      {quest.active ? (
        <button
          className={`${styles.actionBtn} ${styles.actionDanger}`}
          type="button"
          disabled={action.busy}
          onClick={() => {
            if (confirm(t("quests.confirmDeactivate", { name: quest.title }))) {
              void action.run(() => deactivateQuest(quest.id));
            }
          }}
        >
          {t("quests.deactivate")}
        </button>
      ) : (
        <button
          className={styles.actionBtn}
          type="button"
          disabled={action.busy}
          onClick={() => void action.run(() => activateQuest(quest.id))}
        >
          {t("quests.activate")}
        </button>
      )}
      {action.error && <span className={styles.rowError}>{action.error}</span>}
    </div>
  );
}
