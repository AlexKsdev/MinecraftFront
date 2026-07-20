"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AdminQuest, QuestInput } from "@/lib/admin/api";
import { QUEST_ICON_MAP } from "@/features/account/constants";
import styles from "./AdminProducts.module.scss";

/** Mirrors the server's key rule, so a typo is caught before the round trip. */
const KEY_PATTERN = "^[a-z0-9_]+$";

const ICON_NAMES = Object.keys(QUEST_ICON_MAP);

const EMPTY: QuestInput = {
  key: "",
  title: "",
  target: 1,
  rewardType: "COINS",
  rewardAmount: 100,
  icon: ICON_NAMES[0],
  color: "#38bdf8",
  sortOrder: 0,
};

/**
 * Create and edit share one form: the fields and their rules are identical, and
 * a second copy would be a second place for them to drift from the server's.
 */
export function QuestForm({
  initial,
  busy,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: AdminQuest;
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: QuestInput) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Admin");
  const [form, setForm] = useState<QuestInput>(
    initial
      ? {
          key: initial.key,
          title: initial.title,
          target: initial.target,
          rewardType: initial.rewardType,
          rewardAmount: initial.rewardAmount,
          icon: initial.icon,
          color: initial.color,
          sortOrder: initial.sortOrder,
        }
      : EMPTY,
  );

  function set<K extends keyof QuestInput>(key: K, value: QuestInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
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
          <span className={styles.label}>{t("quests.form.key")}</span>
          <input
            className={styles.input}
            value={form.key}
            pattern={KEY_PATTERN}
            required
            onChange={(e) => set("key", e.target.value)}
          />
          <span className={styles.hint}>{t("quests.form.keyHint")}</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.title")}</span>
          <input
            className={styles.input}
            value={form.title}
            required
            onChange={(e) => set("title", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.target")}</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            value={form.target}
            required
            onChange={(e) => set("target", Number(e.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.rewardType")}</span>
          <select
            className={styles.input}
            value={form.rewardType}
            onChange={(e) =>
              set("rewardType", e.target.value as QuestInput["rewardType"])
            }
          >
            <option value="COINS">{t("products.coins")}</option>
            <option value="GEMS">{t("products.gems")}</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.rewardAmount")}</span>
          <input
            className={styles.input}
            type="number"
            min={1}
            value={form.rewardAmount}
            required
            onChange={(e) => set("rewardAmount", Number(e.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.icon")}</span>
          <select
            className={styles.input}
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
          >
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.color")}</span>
          <input
            className={styles.input}
            type="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t("quests.form.sortOrder")}</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
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
