"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { createProduct } from "@/lib/admin/api";
import { ProductForm } from "./ProductForm";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminProducts.module.scss";

/** Folded away until asked for: the table is what an admin comes here to read. */
export function ProductCreate() {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const action = useStepUpAction(() => setOpen(false));

  if (action.awaitingCode) {
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
        {t("products.new")}
      </button>
    );
  }

  return (
    <section className={styles.createCard}>
      <h2 className={styles.createTitle}>{t("products.new")}</h2>
      <ProductForm
        busy={action.busy}
        error={action.error}
        submitLabel={t("products.create")}
        onCancel={() => setOpen(false)}
        onSubmit={(input) => action.run(() => createProduct(input))}
      />
    </section>
  );
}
