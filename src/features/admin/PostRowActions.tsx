"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  publishPost,
  unpublishPost,
  updatePost,
  type AdminPost,
} from "@/lib/admin/api";
import { PostForm } from "./PostForm";
import { StepUpPrompt } from "./StepUpPrompt";
import { useStepUpAction } from "./useStepUpAction";
import styles from "./AdminUsers.module.scss";

/**
 * Edit, and put on / take off the blog. Taking a post down is an unpublish
 * server side, not a delete, so it is offered as a reversible pair.
 */
export function PostRowActions({ post }: { post: AdminPost }) {
  const t = useTranslations("Admin");
  const [editing, setEditing] = useState(false);
  const action = useStepUpAction(() => setEditing(false));

  if (action.awaitingPassword) return <StepUpPrompt action={action} />;

  if (editing) {
    return (
      <PostForm
        initial={post}
        busy={action.busy}
        error={action.error}
        submitLabel={t("blog.save")}
        onCancel={() => setEditing(false)}
        onSubmit={(input) => action.run(() => updatePost(post.id, input))}
      />
    );
  }

  const title = post.translations[0]?.title ?? post.slug;

  return (
    <div className={styles.actions}>
      <button
        className={styles.actionBtn}
        type="button"
        onClick={() => setEditing(true)}
      >
        {t("blog.edit")}
      </button>
      {post.published ? (
        <button
          className={`${styles.actionBtn} ${styles.actionDanger}`}
          type="button"
          disabled={action.busy}
          onClick={() => {
            if (confirm(t("blog.confirmUnpublish", { name: title }))) {
              void action.run(() => unpublishPost(post.id));
            }
          }}
        >
          {t("blog.unpublish")}
        </button>
      ) : (
        <button
          className={styles.actionBtn}
          type="button"
          disabled={action.busy}
          onClick={() => void action.run(() => publishPost(post.id))}
        >
          {t("blog.publish")}
        </button>
      )}
      {action.error && <span className={styles.rowError}>{action.error}</span>}
    </div>
  );
}
