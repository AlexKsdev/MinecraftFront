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

export function storeSession(res: AuthResponse): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(res));
  } catch {
    // ignore storage errors (private mode, quota)
  }
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
}
