"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createQuest } from "@/lib/admin/api";
import { QuestForm } from "./QuestForm";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminProducts.module.scss";

/** Folded away until asked for: the table is what an admin comes here to read. */
export function QuestCreate() {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const action = useStepUpAction(() => setOpen(false));

  if (action.awaitingPassword) {
    return (
      <section className={styles.createCard}>
        <StepUpPrompt action={action} />
      </section>
    );
  }

  if (!open) {
    return (
      <button
        className={styles.createBtn}
        type="button"
        onClick={() => setOpen(true)}
      >
        <Plus size={13} />
        {t("quests.new")}
      </button>
    );
  }

  return (
    <section className={styles.createCard}>
      <h2 className={styles.createTitle}>{t("quests.new")}</h2>
      <QuestForm
        busy={action.busy}
        error={action.error}
        submitLabel={t("quests.create")}
        onCancel={() => setOpen(false)}
        onSubmit={(input) => action.run(() => createQuest(input))}
      />
    </section>
  );
}
