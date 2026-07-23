"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import {
  createWikiArticle,
  publishWikiArticle,
  unpublishWikiArticle,
  updateWikiArticle,
  updateWikiCategory,
  type AdminWikiArticle,
  type AdminWikiCategory,
} from "@/lib/admin/api";
import { CONTENT_LOCALES, localizedTitle } from "./constants";
import { StepUpPrompt } from "./StepUpPrompt";
import { WikiArticleForm } from "./WikiArticleForm";
import { WikiCategoryForm } from "./WikiCategoryForm";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";
import formStyles from "./AdminProducts.module.scss";

/**
 * One category and the articles under it. Everything that mutates lives here
 * rather than on the page, because each action needs its own step-up state —
 * a shared one would make an edit anywhere prompt everywhere.
 */
export function WikiCategoryRow({
  category,
  categories,
}: {
  category: AdminWikiCategory;
  /** For the article form's category picker, so an article can be moved. */
  categories: AdminWikiCategory[];
}) {
  const t = useTranslations("Admin");
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const action = useStepUpAction(() => {
    setEditing(false);
    setAdding(false);
    setEditingArticle(null);
  });

  const locale = useLocale();
  const title = localizedTitle(category.translations, locale, category.key);

  if (action.awaitingPassword) {
    return (
      <section className={formStyles.createCard}>
        <StepUpPrompt action={action} />
      </section>
    );
  }

  return (
    <section className={formStyles.createCard}>
      <div className={styles.actions}>
        <h2 className={formStyles.createTitle}>{title}</h2>
        <span className={styles.mono}>{category.key}</span>
        <button
          className={styles.actionBtn}
          type="button"
          onClick={() => setEditing((v) => !v)}
        >
          {t("wiki.editCategory")}
        </button>
        <button
          className={styles.actionBtn}
          type="button"
          onClick={() => setAdding((v) => !v)}
        >
          <Plus size={13} /> {t("wiki.newArticle")}
        </button>
      </div>

      {editing && (
        <WikiCategoryForm
          initial={category}
          busy={action.busy}
          error={action.error}
          submitLabel={t("wiki.save")}
          onCancel={() => setEditing(false)}
          onSubmit={(input) =>
            action.run(() => updateWikiCategory(category.id, input))
          }
        />
      )}

      {adding && (
        <WikiArticleForm
          categories={categories}
          categoryId={category.id}
          busy={action.busy}
          error={action.error}
          submitLabel={t("wiki.create")}
          onCancel={() => setAdding(false)}
          onSubmit={(input) => action.run(() => createWikiArticle(input))}
        />
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("wiki.table.article")}</th>
            <th>{t("wiki.table.languages")}</th>
            <th>{t("wiki.table.status")}</th>
            <th className={styles.actionsCol}>{t("wiki.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {category.articles.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.empty}>
                {t("wiki.noArticles")}
              </td>
            </tr>
          )}
          {category.articles.map((article) => (
            <ArticleRow
              key={article.id}
              article={article}
              categories={categories}
              editing={editingArticle === article.id}
              onEdit={() =>
                setEditingArticle(
                  editingArticle === article.id ? null : article.id,
                )
              }
              action={action}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ArticleRow({
  article,
  categories,
  editing,
  onEdit,
  action,
}: {
  article: AdminWikiArticle;
  categories: AdminWikiCategory[];
  editing: boolean;
  onEdit: () => void;
  action: ReturnType<typeof useStepUpAction>;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const title = localizedTitle(article.translations, locale, article.slug);
  const written = CONTENT_LOCALES.filter((code) =>
    article.translations.some((tr) => tr.locale === code),
  );

  if (editing) {
    return (
      <tr>
        <td colSpan={4}>
          <WikiArticleForm
            categories={categories}
            categoryId={article.categoryId}
            initial={article}
            busy={action.busy}
            error={action.error}
            submitLabel={t("wiki.save")}
            onCancel={onEdit}
            onSubmit={(input) =>
              action.run(() => updateWikiArticle(article.id, input))
            }
          />
        </td>
      </tr>
    );
  }

  return (
    <tr className={article.published ? "" : styles.dim}>
      <td>
        <div>{title}</div>
        <div className={styles.mono}>{article.slug}</div>
      </td>
      {/* Which languages exist, so a gap is visible without opening the form. */}
      <td className={styles.mono}>{written.join(" / ") || "—"}</td>
      <td>
        <span
          className={`${styles.role} ${article.published ? styles.roleAdmin : ""}`}
        >
          {article.published ? t("wiki.published") : t("wiki.draft")}
        </span>
      </td>
      <td>
        <div className={styles.actions}>
          <button className={styles.actionBtn} type="button" onClick={onEdit}>
            {t("wiki.edit")}
          </button>
          {article.published ? (
            <button
              className={`${styles.actionBtn} ${styles.actionDanger}`}
              type="button"
              disabled={action.busy}
              onClick={() => {
                if (confirm(t("wiki.confirmUnpublish", { name: title }))) {
                  void action.run(() => unpublishWikiArticle(article.id));
                }
              }}
            >
              {t("wiki.unpublish")}
            </button>
          ) : (
            <button
              className={styles.actionBtn}
              type="button"
              disabled={action.busy}
              onClick={() => void action.run(() => publishWikiArticle(article.id))}
            >
              {t("wiki.publish")}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
