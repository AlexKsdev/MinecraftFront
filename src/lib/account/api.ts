import { clearSession, getSession } from "../auth/api";
import { apiFetch } from "../http";
import { API_ERROR_CODES } from "../api-error-codes";
import { ApiError } from "../auth/errors";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  twoFactorEnabled: boolean;
  rank: string;
  avatar: string | null;
  level: number;
  xp: number;
  xpNext: number;
  coins: number;
  gems: number;
  playtimeMinutes: number;
  kills: number;
  deaths: number;
  blocksPlaced: number;
  streak: number;
  createdAt: string;
}

/** Thrown when there is no session or the token is rejected — caller should redirect to login. */
export class UnauthorizedError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "UnauthorizedError";
  }
}

export async function getProfile(): Promise<Profile> {
  const session = getSession();
  if (!session) throw new UnauthorizedError();

  let res: Response;
  try {
    res = await apiFetch("/users/me");
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please try again.",
      API_ERROR_CODES.network,
    );
  }

  if (res.status === 401) {
    clearSession();
    throw new UnauthorizedError();
  }
  if (!res.ok)
    throw new ApiError("Failed to load profile", API_ERROR_CODES.loadFailed);

  return res.json() as Promise<Profile>;
}

export function avatarUrl(profile: Profile): string {
  return profile.avatar ?? `https://mc-heads.net/avatar/${encodeURIComponent(profile.name)}/128`;
}

export function formatPlaytime(minutes: number): string {
  return `${Math.floor(minutes / 60)}h`;
}

export function formatBlocks(count: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(count);
}

export function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
