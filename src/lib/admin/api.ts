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

async function patch(path: string, body: unknown): Promise<void> {
  let res: Response;
  try {
    res = await apiFetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  if (res.ok) return;

  // StepUpGuard answers 403 for a missing or stale proof. AdminGuard uses the
  // same status, but this page is only reachable by admins, so a 403 here means
  // the proof — not the privilege.
  if (res.status === 403) throw new StepUpRequiredError();

  const data = (await res.json().catch(() => null)) as {
    message?: unknown;
    code?: unknown;
  } | null;
  const message =
    typeof data?.message === "string" ? data.message : "Something went wrong.";
  throw new ApiError(message, typeof data?.code === "string" ? data.code : undefined);
}

export function changeRole(userId: string, role: string): Promise<void> {
  return patch(`/users/${userId}/role`, { role });
}

/** Deltas, not totals — the server increments what it is given. */
export function adjustBalance(
  userId: string,
  delta: { coins?: number; gems?: number },
): Promise<void> {
  return patch(`/users/${userId}/balance`, delta);
}

export async function deleteUser(userId: string): Promise<void> {
  let res: Response;
  try {
    res = await apiFetch(`/users/${userId}`, { method: "DELETE" });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  if (res.ok) return;
  if (res.status === 403) throw new StepUpRequiredError();
  throw new Error("Could not delete the user.");
}
