import { apiFetch, readCookie } from "../http";
import type { LoginInput, RegisterInput } from "./schemas";

/** Set by the server alongside the httpOnly token cookies. Display-only. */
const USER_COOKIE = "pc_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * The session as the client can see it. Tokens are httpOnly cookies and are
 * deliberately absent — there is nothing here for an XSS to steal.
 */
export interface AuthResponse {
  user: AuthUser;
}

async function postAuth(path: string, body: unknown): Promise<AuthResponse> {
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
    throw new Error(extractError(data));
  }

  return data as AuthResponse;
}

function extractError(data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return "Something went wrong. Please try again.";
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return postAuth("/auth/login", input);
}

export function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return postAuth("/auth/register", input);
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
  if (!res.ok) throw new Error(extractError(data));
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

function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
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
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
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
