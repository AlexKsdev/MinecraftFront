"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type {
  AdminWikiCategory,
  AdminWikiCategoryTranslation,
  WikiCategoryInput,
} from "@/lib/admin/api";
import {
  CONTENT_LOCALES,
  WIKI_ACCENTS,
  WIKI_ICONS,
  type ContentLocale,
} from "./constants";
import styles from "./AdminProducts.module.scss";

/** Mirrors the server's key rule, so a typo is caught before the round trip. */
const KEY_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

function emptyTranslation(
  locale: ContentLocale,
): AdminWikiCategoryTranslation {
  return { locale, title: "" };
}

const EMPTY: WikiCategoryInput = {
  key: "",
  icon: WIKI_ICONS[0],
  accent: WIKI_ACCENTS[0],
  translations: CONTENT_LOCALES.map(emptyTranslation),
};

/**
 * A category carries only a name per language, so both locales sit side by side
 * rather than behind tabs — two short inputs are cheaper to read than a tab
 * strip. The article form, which has a body, does use tabs.
 */
export function WikiCategoryForm({
  initial,
  busy,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: AdminWikiCategory;
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: WikiCategoryInput) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Admin");
  const [form, setForm] = useState<WikiCategoryInput>(
    initial
      ? {
          key: initial.key,
          icon: initial.icon,
          accent: initial.accent,
          sortOrder: initial.sortOrder,
          // A category may have only one translation so far; the missing one
          // opens blank rather than being absent from the form.
          translations: CONTENT_LOCALES.map(
            (locale) =>
              initial.translations.find((tr) => tr.locale === locale) ??
              emptyTranslation(locale),
          ),
        }
      : EMPTY,
  );

  function set<K extends keyof WikiCategoryInput>(
    key: K,
    value: WikiCategoryInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setTitle(locale: ContentLocale, title: string) {
    setForm((f) => ({
      ...f,
      translations: f.translations.map((tr) =>
        tr.locale === locale ? { ...tr, title } : tr,
      ),
    }));
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {error && <p className={styles.formError}>{error}</p>}

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.key")}</span>
          <input
            className={styles.input}
            value={form.key}
            pattern={KEY_PATTERN}
            required
            onChange={(e) => set("key", e.target.value)}
          />
          <span className={styles.hint}>{t("wiki.form.keyHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.sortOrder")}</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={form.sortOrder ?? 0}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.icon")}</span>
          <select
            className={styles.input}
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
          >
            {WIKI_ICONS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.accent")}</span>
          <select
            className={styles.input}
            value={form.accent}
            onChange={(e) => set("accent", e.target.value)}
          >
            {WIKI_ACCENTS.map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>
        </label>

        {form.translations.map((tr) => (
          <label key={tr.locale} className={styles.field}>
            <span className={styles.label}>
              {t("wiki.form.title")} ({tr.locale})
            </span>
            <input
              className={styles.input}
              value={tr.title}
              required
              onChange={(e) => setTitle(tr.locale, e.target.value)}
            />
          </label>
        ))}
      </div>

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
