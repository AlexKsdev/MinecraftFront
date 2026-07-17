"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  activateProduct,
  deactivateProduct,
  updateProduct,
  type AdminProduct,
} from "@/lib/admin/api";
import { ProductForm } from "./ProductForm";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";

/**
 * Edit, and take off / put back on the shop. Removal is a deactivation server
 * side — purchase history has to keep pointing at what was bought — so it is
 * offered as a reversible pair rather than a delete.
 */
export function ProductRowActions({ product }: { product: AdminProduct }) {
  const t = useTranslations("Admin");
  const [editing, setEditing] = useState(false);
  const action = useStepUpAction(() => setEditing(false));

  if (action.awaitingCode) return <StepUpPrompt action={action} />;

  if (editing) {
    return (
      <ProductForm
        initial={product}
        busy={action.busy}
        error={action.error}
        submitLabel={t("products.save")}
        onCancel={() => setEditing(false)}
        onSubmit={(input) => action.run(() => updateProduct(product.id, input))}
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
        {t("products.edit")}
      </button>
      {product.active ? (
        <button
          className={`${styles.actionBtn} ${styles.actionDanger}`}
          type="button"
          disabled={action.busy}
          onClick={() => {
            if (confirm(t("products.confirmDeactivate", { name: product.name }))) {
              void action.run(() => deactivateProduct(product.id));
            }
          }}
        >
          {t("products.deactivate")}
        </button>
      ) : (
        <button
          className={styles.actionBtn}
          type="button"
          disabled={action.busy}
          onClick={() => void action.run(() => activateProduct(product.id))}
        >
          {t("products.activate")}
        </button>
      )}
      {action.error && <span className={styles.rowError}>{action.error}</span>}
    </div>
  );
}
