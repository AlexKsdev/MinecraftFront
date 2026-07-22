"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createPost } from "@/lib/admin/api";
import { PostForm } from "./PostForm";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminProducts.module.scss";

/** Folded away until asked for: the table is what an admin comes here to read. */
export function PostCreate() {
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
        {t("blog.new")}
      </button>
    );
  }

  return (
    <section className={styles.createCard}>
      <h2 className={styles.createTitle}>{t("blog.new")}</h2>
      <PostForm
        busy={action.busy}
        error={action.error}
        submitLabel={t("blog.create")}
        onCancel={() => setOpen(false)}
        onSubmit={(input) => action.run(() => createPost(input))}
      />
    </section>
  );
}
