"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createWikiCategory } from "@/lib/admin/api";
import { StepUpPrompt } from "./StepUpPrompt";
import { WikiCategoryForm } from "./WikiCategoryForm";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminProducts.module.scss";

/** Folded away until asked for: the list is what an admin comes here to read. */
export function WikiCategoryCreate() {
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
        {t("wiki.newCategory")}
      </button>
    );
  }

  return (
    <section className={styles.createCard}>
      <h2 className={styles.createTitle}>{t("wiki.newCategory")}</h2>
      <WikiCategoryForm
        busy={action.busy}
        error={action.error}
        submitLabel={t("wiki.create")}
        onCancel={() => setOpen(false)}
        onSubmit={(input) => action.run(() => createWikiCategory(input))}
      />
    </section>
  );
}
