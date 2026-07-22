"use client";

import { apiFetch } from "../http";
import { ApiError } from "../auth/errors";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  coins: number;
  gems: number;
  level: number;
  createdAt: string;
}

export interface PaginatedUsers {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Thrown when the server wants a factor re-proved before it will do this. The
 * caller should collect a code and retry rather than surface it as a failure.
 */
export class StepUpRequiredError extends Error {
  constructor() {
    super("Re-authentication required");
    this.name = "StepUpRequiredError";
  }
}

/**
 * Every admin mutation goes through here: they all sit behind StepUpGuard and
 * so all answer 403 the same way when the proof is missing or stale.
 *
 * That 403 is unambiguous on these pages — the route group is already
 * admin-gated server-side, so a refusal means the proof, not the privilege.
 * It's raised as its own error type so the caller can collect a code and retry
 * rather than show a dead end.
 */
async function send<T>(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  let res: Response;
  try {
    res = await apiFetch(path, {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  if (res.status === 403) throw new StepUpRequiredError();

  const data = (await res.json().catch(() => null)) as {
    message?: unknown;
    code?: unknown;
  } | null;

  if (!res.ok) {
    const message =
      typeof data?.message === "string" ? data.message : "Something went wrong.";
    throw new ApiError(
      message,
      typeof data?.code === "string" ? data.code : undefined,
    );
  }
  return data as T;
}

export interface AdminProduct {
  id: string;
  slug: string;
  category: string;
  name: string;
  emoji: string;
  rarity: string;
  rarityRank: number;
  currency: "COINS" | "GEMS";
  price: number;
  badge: string | null;
  stats: string[];
  active: boolean;
}

export interface PaginatedProducts {
  items: AdminProduct[];
  total: number;
  page: number;
  limit: number;
}

/** The shape the create/edit form collects. */
export interface ProductInput {
  slug: string;
  category: string;
  name: string;
  emoji: string;
  rarity: string;
  rarityRank: number;
  currency: "COINS" | "GEMS";
  price: number;
  badge?: string;
  stats?: string[];
}

/* ── Users ── */

export function changeRole(userId: string, role: string): Promise<void> {
  return send("PATCH", `/users/${userId}/role`, { role });
}

/** Deltas, not totals — the server increments what it is given. */
export function adjustBalance(
  userId: string,
  delta: { coins?: number; gems?: number },
): Promise<void> {
  return send("PATCH", `/users/${userId}/balance`, delta);
}

export function deleteUser(userId: string): Promise<void> {
  return send("DELETE", `/users/${userId}`);
}

/* ── Products ── */

export function createProduct(input: ProductInput): Promise<AdminProduct> {
  return send("POST", "/products", input);
}

export function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<AdminProduct> {
  return send("PATCH", `/products/${id}`, input);
}

/**
 * Takes the product off the shop. The server deactivates rather than deletes —
 * purchase history has to keep pointing at what was bought — so this is
 * reversible.
 */
export function deactivateProduct(id: string): Promise<AdminProduct> {
  return send("DELETE", `/products/${id}`);
}

/** The way back from deactivation. */
export function activateProduct(id: string): Promise<AdminProduct> {
  return send("POST", `/products/${id}/activate`);
}

/* ── Quests (catalogue) ── */

export interface AdminQuest {
  id: string;
  key: string;
  title: string;
  target: number;
  rewardType: "COINS" | "GEMS";
  rewardAmount: number;
  icon: string;
  color: string;
  active: boolean;
  sortOrder: number;
}

export type QuestInput = Omit<AdminQuest, "id" | "active">;

export function createQuest(input: QuestInput): Promise<AdminQuest> {
  return send("POST", "/quests", input);
}

export function updateQuest(
  id: string,
  input: Partial<QuestInput>,
): Promise<AdminQuest> {
  return send("PATCH", `/quests/${id}`, input);
}

export function activateQuest(id: string): Promise<AdminQuest> {
  return send("POST", `/quests/${id}/activate`);
}

/** Removal from the daily set is a deactivation — claims must keep meaning. */
export function deactivateQuest(id: string): Promise<AdminQuest> {
  return send("DELETE", `/quests/${id}`);
}

/* ── Blog posts ── */

/**
 * Re-exported as a type only. The list itself lives in features/admin/constants
 * because this module is `"use client"` — a Server Component importing a value
 * from here gets a client reference rather than the array.
 */
export type { PostLocale } from "@/features/admin/constants";

import type { PostLocale } from "@/features/admin/constants";

export interface AdminPostTranslation {
  locale: PostLocale;
  title: string;
  excerpt: string;
  /** The tag chip's wording — display text, so it is per-language. */
  tag: string;
  /** Markdown. */
  body: string;
}

export interface AdminPost {
  id: string;
  slug: string;
  image: string;
  /** The chip's colour, which is the same in every language. */
  tagAccent: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  translations: AdminPostTranslation[];
}

export type PostInput = Omit<
  AdminPost,
  "id" | "published" | "publishedAt" | "createdAt"
>;

export function createPost(input: PostInput): Promise<AdminPost> {
  return send("POST", "/posts", input);
}

/**
 * Translations left out of `input` keep whatever they had, so saving the
 * English copy cannot wipe the Ukrainian one.
 */
export function updatePost(
  id: string,
  input: Partial<PostInput>,
): Promise<AdminPost> {
  return send("PATCH", `/posts/${id}`, input);
}

export function publishPost(id: string): Promise<AdminPost> {
  return send("POST", `/posts/${id}/publish`);
}

/** Not a delete: taking a post off the blog is reversible. */
export function unpublishPost(id: string): Promise<AdminPost> {
  return send("DELETE", `/posts/${id}`);
}

/* ── Payments ── */

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
];

/** The buyer, trimmed to what an orders row needs to identify them. */
export interface PaymentBuyer {
  id: string;
  name: string;
  email: string;
}

export interface AdminPayment {
  id: string;
  userId: string;
  amount: number;
  gems: number;
  description: string | null;
  status: PaymentStatus;
  stripePaymentId: string | null;
  createdAt: string;
  user: PaymentBuyer;
}

export interface PaginatedPayments {
  items: AdminPayment[];
  total: number;
  page: number;
  limit: number;
}

/** Behind StepUpGuard + audited on the server — it moves money. */
export function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
): Promise<AdminPayment> {
  return send("PATCH", `/payments/${id}/status`, { status });
}
