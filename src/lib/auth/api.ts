import { apiFetch, readCookie } from "../http";
import { ApiError } from "./errors";
import type { LoginInput, RegisterInput } from "./schemas";

/** Set by the server alongside the httpOnly token cookies. Display-only. */
const USER_COOKIE = "pc_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  twoFactorEnabled: boolean;
}

/**
 * The session as the client can see it. Tokens are httpOnly cookies and are
 * deliberately absent — there is nothing here for an XSS to steal.
 */
export interface AuthResponse {
  user: AuthUser;
}

/**
 * The password checked out but 2FA is on, so no session exists yet — only a
 * short-lived pending cookie the server will redeem for one at /auth/2fa/verify.
 */
export interface TwoFactorRequired {
  twoFactorRequired: true;
}

export type LoginResult = AuthResponse | TwoFactorRequired;

export function isTwoFactorRequired(
  result: LoginResult,
): result is TwoFactorRequired {
  return "twoFactorRequired" in result;
}

async function postAuth<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await apiFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw extractError(data);
  }

  return data as T;
}

/**
 * Rebuilds the server's error as an ApiError, keeping its `code` so the UI can
 * localize it. Validation failures arrive as an array of messages.
 */
function extractError(data: unknown): ApiError {
  const body = (data ?? {}) as { message?: unknown; code?: unknown };
  const code = typeof body.code === "string" ? body.code : undefined;

  if (Array.isArray(body.message)) {
    return new ApiError(body.message.join(", "), code);
  }
  if (typeof body.message === "string" && body.message.length > 0) {
    return new ApiError(body.message, code);
  }
  return new ApiError("Something went wrong. Please try again.", code);
}

/**
 * Either signs in outright or reports that a TOTP code is still owed. With 2FA
 * on there is no session yet — only `verifyTwoFactor` can finish the login.
 */
export function login(input: LoginInput): Promise<LoginResult> {
  return postAuth<LoginResult>("/auth/login", input);
}

export function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return postAuth<AuthResponse>("/auth/register", input);
}

/** Second login step: redeems the pending 2FA cookie for a real session. */
export function verifyTwoFactor(code: string): Promise<AuthResponse> {
  return postAuth<AuthResponse>("/auth/2fa/verify", { code });
}

/** Re-sends the emailed login code during the pending 2FA step. */
export function resendTwoFactor(): Promise<void> {
  return postNoContent("/auth/2fa/resend", {});
}

/** Emails a confirmation code; 2FA stays off until `enableTwoFactor` proves it. */
export function setupTwoFactor(): Promise<void> {
  return postNoContent("/auth/2fa/setup", {});
}

export function enableTwoFactor(code: string): Promise<void> {
  return postNoContent("/auth/2fa/enable", { code });
}

/** Emails the code needed to turn 2FA off (paired with the password). */
export function requestDisableCode(): Promise<void> {
  return postNoContent("/auth/2fa/disable/request", {});
}

/** Turning 2FA off is a downgrade, so the server re-proves both factors. */
export function disableTwoFactor(password: string, code: string): Promise<void> {
  return postNoContent("/auth/2fa/disable", { password, code });
}

/**
 * Re-proves the password so the server will allow a destructive action for the
 * next few minutes. With authenticator codes gone, the password is the factor.
 */
export function stepUp(password: string): Promise<void> {
  return postNoContent("/auth/step-up", { password });
}

/** For endpoints that answer 204 — there is no body to parse on success. */
async function postNoContent(path: string, body: unknown): Promise<void> {
  let res: Response;
  try {
    res = await apiFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  if (!res.ok) {
    throw extractError(await res.json().catch(() => null));
  }
}

async function postJson(
  path: string,
  body: unknown,
): Promise<{ message: string }> {
  let res: Response;
  try {
    res = await apiFetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw extractError(data);
  return data as { message: string };
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return postJson("/auth/forgot-password", { email });
}

export function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  return postJson("/auth/reset-password", { token, newPassword });
}

/** Fires (same-tab) whenever the session changes, so the UI can react. */
export const AUTH_EVENT = "pc-authchange";

/**
 * Cross-tab counterpart of AUTH_EVENT. The session lives in cookies now, and a
 * cookie write fires no `storage` event, so sibling tabs have to be told.
 */
const AUTH_CHANNEL = "pc-authchange";

let authChannel: BroadcastChannel | null | undefined;

function getAuthChannel(): BroadcastChannel | null {
  if (authChannel === undefined) {
    authChannel =
      typeof BroadcastChannel === "function"
        ? new BroadcastChannel(AUTH_CHANNEL)
        : null;
  }
  return authChannel;
}

function notifyAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));
  // BroadcastChannel never echoes back to the sender, so this reaches the
  // other tabs only — no double notification here.
  getAuthChannel()?.postMessage(AUTH_EVENT);
}

/** Fires when any component wants the login/register modal opened. */
export const OPEN_AUTH_EVENT = "pc-open-auth";

/** Request the auth modal from anywhere (e.g. a Buy click while logged out). */
export function openAuthModal(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_AUTH_EVENT));
  }
}

/**
 * The server already set the session cookies on the login/register response —
 * there is nothing for the client to persist. This just wakes the UI up.
 */
export function notifySignedIn(): void {
  notifyAuthChange();
}

/** End the session: only the server can clear the httpOnly cookies. */
export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Even if the call fails, drop the local view of the session.
  }
  notifyAuthChange();
}

/**
 * Forget the session locally. Used when the server has already told us the
 * session is dead (401) — the cookies are invalid at that point anyway.
 */
export function clearSession(): void {
  notifyAuthChange();
}

export function getSession(): AuthResponse | null {
  return getSessionSnapshot();
}

// Cached snapshot so useSyncExternalStore gets a stable reference unless the
// cookie actually changes (re-parsing every call would loop forever).
let cachedRaw: string | null = null;
let cachedSession: AuthResponse | null = null;

export function subscribeSession(callback: () => void): () => void {
  const channel = getAuthChannel();
  window.addEventListener(AUTH_EVENT, callback);
  channel?.addEventListener("message", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    channel?.removeEventListener("message", callback);
  };
}

export function getSessionSnapshot(): AuthResponse | null {
  const raw = readCookie(USER_COOKIE);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSession = raw ? { user: JSON.parse(raw) as AuthUser } : null;
    } catch {
      cachedSession = null;
    }
  }
  return cachedSession;
}
