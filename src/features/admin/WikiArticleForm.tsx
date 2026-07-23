"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type {
  AdminWikiArticle,
  AdminWikiArticleTranslation,
  AdminWikiCategory,
  WikiArticleInput,
} from "@/lib/admin/api";
import {
  CONTENT_LOCALES,
  localizedTitle,
  type ContentLocale,
} from "./constants";
import styles from "./AdminProducts.module.scss";

/** Mirrors the server's slug rule, so a typo is caught before the round trip. */
const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

function emptyTranslation(locale: ContentLocale): AdminWikiArticleTranslation {
  return { locale, title: "", summary: "", body: "" };
}

/**
 * Create and edit share one form, as with posts. A tab per locale keeps both
 * copies side by side without doubling the page; every locale stays mounted in
 * state, so switching tabs never loses what was typed in the other.
 */
export function WikiArticleForm({
  categories,
  categoryId,
  initial,
  busy,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  /** For the category picker — an article always belongs to one. */
  categories: AdminWikiCategory[];
  /** The category this article starts in. */
  categoryId: string;
  initial?: AdminWikiArticle;
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: WikiArticleInput) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [tab, setTab] = useState<ContentLocale>(CONTENT_LOCALES[0]);
  const [form, setForm] = useState<WikiArticleInput>(
    initial
      ? {
          slug: initial.slug,
          categoryId: initial.categoryId,
          sortOrder: initial.sortOrder,
          translations: CONTENT_LOCALES.map(
            (code) =>
              initial.translations.find((tr) => tr.locale === code) ??
              emptyTranslation(code),
          ),
        }
      : {
          slug: "",
          categoryId,
          translations: CONTENT_LOCALES.map(emptyTranslation),
        },
  );

  function set<K extends keyof WikiArticleInput>(
    key: K,
    value: WikiArticleInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setText<K extends keyof AdminWikiArticleTranslation>(
    locale: ContentLocale,
    key: K,
    value: AdminWikiArticleTranslation[K],
  ) {
    setForm((f) => ({
      ...f,
      translations: f.translations.map((tr) =>
        tr.locale === locale ? { ...tr, [key]: value } : tr,
      ),
    }));
  }

  const active = form.translations.find((tr) => tr.locale === tab)!;

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
          <span className={styles.label}>{t("wiki.form.slug")}</span>
          <input
            className={styles.input}
            value={form.slug}
            pattern={SLUG_PATTERN}
            required
            onChange={(e) => set("slug", e.target.value)}
          />
          <span className={styles.hint}>{t("wiki.form.slugHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.category")}</span>
          {/* Editable, so an article can be moved without being rewritten. */}
          <select
            className={styles.input}
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {localizedTitle(category.translations, locale, category.key)}
              </option>
            ))}
          </select>
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
      </div>

      <div
        className={styles.localeTabs}
        role="tablist"
        aria-label={t("wiki.form.language")}
      >
        {CONTENT_LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            role="tab"
            aria-selected={code === tab}
            className={`${styles.localeTab} ${code === tab ? styles.localeTabActive : ""}`}
            onClick={() => setTab(code)}
          >
            {code}
          </button>
        ))}
      </div>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.title")}</span>
          <input
            className={styles.input}
            value={active.title}
            required
            onChange={(e) => setText(tab, "title", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.summary")}</span>
          <textarea
            className={styles.input}
            rows={3}
            value={active.summary}
            required
            onChange={(e) => setText(tab, "summary", e.target.value)}
          />
          <span className={styles.hint}>{t("wiki.form.summaryHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("wiki.form.body")}</span>
          <textarea
            className={styles.input}
            rows={12}
            value={active.body}
            required
            onChange={(e) => setText(tab, "body", e.target.value)}
          />
          <span className={styles.hint}>{t("wiki.form.bodyHint")}</span>
        </label>
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
