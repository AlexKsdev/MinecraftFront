import { apiFetch } from "../http";

export type QuestRewardType = "COINS" | "GEMS";

export interface QuestReward {
  type: QuestRewardType;
  amount: number;
}

export interface Quest {
  key: string;
  target: number;
  progress: number;
  reward: QuestReward;
  completed: boolean;
  claimed: boolean;
}

export interface QuestList {
  quests: Quest[];
  /** ISO instant of the next reset — the tab counts down to it. */
  resetAt: string;
}

export interface QuestClaimResult {
  coins: number;
  gems: number;
  reward: QuestReward;
}

export async function getQuests(): Promise<QuestList> {
  const res = await apiFetch("/quests");
  if (!res.ok) throw new Error("Failed to load quests");
  return res.json() as Promise<QuestList>;
}

export async function claimQuest(key: string): Promise<QuestClaimResult> {
  const res = await apiFetch(`/quests/${encodeURIComponent(key)}/claim`, {
    method: "POST",
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      message?: unknown;
    } | null;
    throw new Error(
      typeof data?.message === "string" ? data.message : "Claim failed",
    );
  }
  return res.json() as Promise<QuestClaimResult>;
}
