"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type {
  AdminPost,
  AdminPostTranslation,
  PostInput,
} from "@/lib/admin/api";
import { POST_LOCALES, POST_TAG_ACCENTS, type PostLocale } from "./constants";
import styles from "./AdminProducts.module.scss";

/** Mirrors the server's slug rule, so a typo is caught before the round trip. */
const SLUG_PATTERN = "^[a-z0-9]+(?:-[a-z0-9]+)*$";

function emptyTranslation(locale: PostLocale): AdminPostTranslation {
  return { locale, title: "", excerpt: "", tag: "", body: "" };
}

const EMPTY: PostInput = {
  slug: "",
  image: "",
  tagAccent: POST_TAG_ACCENTS[0],
  author: "",
  translations: POST_LOCALES.map(emptyTranslation),
};

/**
 * Create and edit share one form: the fields and their rules are identical, and
 * a second copy would be a second place for them to drift from the server's.
 *
 * Both languages are always present in the form, and both are always submitted.
 * A tab per locale keeps the two copies side by side without doubling the
 * page — the shared fields (slug, image, author, accent) sit above them,
 * because they are the same text in every language.
 */
export function PostForm({
  initial,
  busy,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: AdminPost;
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: PostInput) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Admin");
  const [tab, setTab] = useState<PostLocale>(POST_LOCALES[0]);
  const [form, setForm] = useState<PostInput>(
    initial
      ? {
          slug: initial.slug,
          image: initial.image,
          tagAccent: initial.tagAccent,
          author: initial.author,
          // A post may have only one translation so far; the missing one opens
          // blank rather than being absent from the form.
          translations: POST_LOCALES.map(
            (locale) =>
              initial.translations.find((tr) => tr.locale === locale) ??
              emptyTranslation(locale),
          ),
        }
      : EMPTY,
  );

  function set<K extends keyof PostInput>(key: K, value: PostInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setText<K extends keyof AdminPostTranslation>(
    locale: PostLocale,
    key: K,
    value: AdminPostTranslation[K],
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
          <span className={styles.label}>{t("blog.form.slug")}</span>
          <input
            className={styles.input}
            value={form.slug}
            pattern={SLUG_PATTERN}
            required
            onChange={(e) => set("slug", e.target.value)}
          />
          <span className={styles.hint}>{t("blog.form.slugHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.author")}</span>
          <input
            className={styles.input}
            value={form.author}
            required
            onChange={(e) => set("author", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.image")}</span>
          <input
            className={styles.input}
            type="url"
            value={form.image}
            required
            onChange={(e) => set("image", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.tagAccent")}</span>
          <select
            className={styles.input}
            value={form.tagAccent}
            onChange={(e) => set("tagAccent", e.target.value)}
          >
            {POST_TAG_ACCENTS.map((accent) => (
              <option key={accent} value={accent}>
                {accent}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={styles.localeTabs}
        role="tablist"
        aria-label={t("blog.form.language")}
      >
        {POST_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={locale === tab}
            className={`${styles.localeTab} ${locale === tab ? styles.localeTabActive : ""}`}
            onClick={() => setTab(locale)}
          >
            {locale}
          </button>
        ))}
      </div>

      {/*
        Every locale stays mounted in state, so switching tabs never loses what
        was typed in the other one — only the visible fields change.
      */}
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.title")}</span>
          <input
            className={styles.input}
            value={active.title}
            required
            onChange={(e) => setText(tab, "title", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.tag")}</span>
          <input
            className={styles.input}
            value={active.tag}
            required
            onChange={(e) => setText(tab, "tag", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.excerpt")}</span>
          <textarea
            className={styles.input}
            rows={3}
            value={active.excerpt}
            required
            onChange={(e) => setText(tab, "excerpt", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("blog.form.body")}</span>
          <textarea
            className={styles.input}
            rows={12}
            value={active.body}
            required
            onChange={(e) => setText(tab, "body", e.target.value)}
          />
          <span className={styles.hint}>{t("blog.form.bodyHint")}</span>
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
