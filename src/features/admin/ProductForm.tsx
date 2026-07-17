"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AdminProduct, ProductInput } from "@/lib/admin/api";
import styles from "./AdminProducts.module.scss";

/** Mirrors the server's slug rule, so a typo is caught before the round trip. */
const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

const EMPTY: ProductInput = {
  slug: "",
  category: "",
  name: "",
  emoji: "",
  rarity: "",
  rarityRank: 1,
  currency: "COINS",
  price: 0,
};

/**
 * Create and edit share one form: the fields and their rules are identical, and
 * a second copy would be a second place for them to drift from the server's.
 */
export function ProductForm({
  initial,
  busy,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: AdminProduct;
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Admin");
  const [form, setForm] = useState<ProductInput>(
    initial
      ? {
          slug: initial.slug,
          category: initial.category,
          name: initial.name,
          emoji: initial.emoji,
          rarity: initial.rarity,
          rarityRank: initial.rarityRank,
          currency: initial.currency,
          price: initial.price,
          badge: initial.badge ?? undefined,
          stats: initial.stats,
        }
      : EMPTY,
  );

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      noValidate
    >
      <div className={styles.formGrid}>
        <Field label={t("products.form.name")}>
          <input
            className={styles.input}
            required
            maxLength={80}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label={t("products.form.slug")} hint={t("products.form.slugHint")}>
          <input
            className={styles.input}
            required
            pattern={SLUG_PATTERN}
            maxLength={60}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>
        <Field label={t("products.form.category")}>
          <input
            className={styles.input}
            required
            maxLength={40}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
        </Field>
        <Field label={t("products.form.emoji")}>
          <input
            className={styles.input}
            required
            maxLength={8}
            value={form.emoji}
            onChange={(e) => set("emoji", e.target.value)}
          />
        </Field>
        <Field label={t("products.form.rarity")}>
          <input
            className={styles.input}
            required
            maxLength={20}
            value={form.rarity}
            onChange={(e) => set("rarity", e.target.value)}
          />
        </Field>
        <Field label={t("products.form.rarityRank")} hint={t("products.form.rankHint")}>
          <input
            className={styles.input}
            type="number"
            min={0}
            max={5}
            required
            value={form.rarityRank}
            onChange={(e) => set("rarityRank", Number(e.target.value))}
          />
        </Field>
        <Field label={t("products.form.currency")}>
          <select
            className={styles.input}
            value={form.currency}
            onChange={(e) =>
              set("currency", e.target.value as ProductInput["currency"])
            }
          >
            <option value="COINS">{t("products.coins")}</option>
            <option value="GEMS">{t("products.gems")}</option>
          </select>
        </Field>
        <Field label={t("products.form.price")}>
          <input
            className={styles.input}
            type="number"
            min={0}
            required
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>
        <Field label={t("products.form.badge")}>
          <input
            className={styles.input}
            maxLength={20}
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value || undefined)}
          />
        </Field>
        <Field label={t("products.form.stats")} hint={t("products.form.statsHint")}>
          <input
            className={styles.input}
            value={(form.stats ?? []).join(", ")}
            onChange={(e) =>
              set(
                "stats",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? t("products.saving") : submitLabel}
        </button>
        <button className={styles.linkBtn} type="button" onClick={onCancel}>
          {t("users.cancel")}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}
