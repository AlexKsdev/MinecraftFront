import type { LoginInput, RegisterInput } from "./schemas";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const SESSION_KEY = "pc-auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

async function postAuth(path: string, body: unknown): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
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

/** Fires (same-tab) whenever the stored session changes, so the UI can react. */
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

export function storeSession(res: AuthResponse): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(res));
  } catch {
    // ignore storage errors (private mode, quota)
  }
  notifyAuthChange();
}

export function getSession(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
  notifyAuthChange();
}

// Cached snapshot so useSyncExternalStore gets a stable reference unless the
// stored value actually changes (re-parsing every call would loop forever).
let cachedRaw: string | null = null;
let cachedSession: AuthResponse | null = null;

export function subscribeSession(callback: () => void): () => void {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getSessionSnapshot(): AuthResponse | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SESSION_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSession = raw ? (JSON.parse(raw) as AuthResponse) : null;
  }
  return cachedSession;
}
