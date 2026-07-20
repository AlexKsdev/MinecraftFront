import {
  Sword, Map, Coins, Star, Zap, Gem, Crown, Shield,
  Gift, Award, Target, Users, Calendar, Flame, Trophy, BarChart3,
  Pickaxe, Box, Hammer, Footprints, Fish, PawPrint, FlaskConical,
  Sparkles, Skull, Wheat, DoorOpen,
  type LucideIcon,
} from "lucide-react";

export type TabId = "overview" | "bonuses" | "referral" | "achievements" | "quests" | "security";

// Tab labels live in the Account messages namespace (keyed by `id`).
export const TABS: { id: TabId; icon: LucideIcon }[] = [
  { id: "overview", icon: BarChart3 },
  { id: "bonuses", icon: Gift },
  { id: "referral", icon: Users },
  { id: "achievements", icon: Trophy },
  { id: "quests", icon: Target },
  { id: "security", icon: Shield },
];

/* ── Overview ── */
export const RECENT_ACTIVITY: { action: string; time: string; color: string }[] = [
  { action: "Won Arena Battle vs DiamondGirl", time: "1h ago", color: "#f87171" },
  { action: "Opened Rare Crate — got Diamond Sword", time: "3h ago", color: "#60a5fa" },
  { action: "Traded 500 Coins with CreeperKing", time: "Yesterday", color: "#fbbf24" },
  { action: "Completed daily quest: Mine 200 Ores", time: "Yesterday", color: "var(--primary)" },
  { action: "Earned Achievement: Builder Pro", time: "2 days ago", color: "#a855f7" },
];

export const PERKS = ["Fly Mode", "2x XP Active", "Elite Rank", "Custom Nick", "Priority Queue", "10 Homes"];

/* ── Bonuses ── */
export const DAILY_BONUSES: {
  day: number; reward: string; icon: LucideIcon; color: string; claimed: boolean; today?: boolean;
}[] = [
  { day: 1, reward: "100 Coins", icon: Coins, color: "#fbbf24", claimed: true },
  { day: 2, reward: "200 Coins", icon: Coins, color: "#fbbf24", claimed: true },
  { day: 3, reward: "1 Rare Key", icon: Star, color: "#60a5fa", claimed: true },
  { day: 4, reward: "500 Coins", icon: Coins, color: "#fbbf24", claimed: true },
  { day: 5, reward: "2x XP (1h)", icon: Zap, color: "#4ade80", claimed: true },
  { day: 6, reward: "1 Elite Key", icon: Gem, color: "#38bdf8", claimed: true },
  { day: 7, reward: "Legend Crate", icon: Crown, color: "#a855f7", claimed: false, today: true },
  { day: 8, reward: "1000 Coins", icon: Coins, color: "#fbbf24", claimed: false },
  { day: 9, reward: "3 Rare Keys", icon: Star, color: "#60a5fa", claimed: false },
  { day: 10, reward: "VIP for 3d", icon: Shield, color: "#fbbf24", claimed: false },
  { day: 11, reward: "5000 Coins", icon: Coins, color: "#fbbf24", claimed: false },
  { day: 12, reward: "Mystery Box", icon: Gift, color: "#f472b6", claimed: false },
  { day: 13, reward: "2x XP (24h)", icon: Zap, color: "#4ade80", claimed: false },
  { day: 14, reward: "MEGA Crate", icon: Crown, color: "#facc15", claimed: false },
];

export const COIN_REWARDS: { label: string; desc: string; reward: string; icon: LucideIcon; color: string }[] = [
  { label: "Vote Reward", desc: "Vote for the server daily", reward: "+150 Coins", icon: Star, color: "#fbbf24" },
  { label: "Forum Post", desc: "Post in the community forum", reward: "+50 Coins", icon: Award, color: "#38bdf8" },
  { label: "Bug Report", desc: "Submit a valid bug report", reward: "+300 Coins", icon: Target, color: "var(--primary)" },
];

/* ── Referral ── */
export const REFERRAL_CODE = "STEVE-PC42";
export const REFERRAL_FRIENDS: { name: string; joined: string; reward: number; avatar: string }[] = [
  { name: "Alex_B", joined: "2 days ago", reward: 200, avatar: "https://mc-heads.net/avatar/Alex/32" },
  { name: "CreeperKing", joined: "1 week ago", reward: 200, avatar: "https://mc-heads.net/avatar/Herobrine/32" },
  { name: "DiamondGirl", joined: "2 weeks ago", reward: 200, avatar: "https://mc-heads.net/avatar/DiamondGirl/32" },
];
export const REFERRAL_MILESTONES: { target: number; reward: string; done: boolean }[] = [
  { target: 1, reward: "200 Coins", done: true },
  { target: 3, reward: "1 Elite Key + Badge", done: true },
  { target: 5, reward: "Referral Legend Badge + 1000 Coins", done: false },
  { target: 10, reward: "VIP Rank (7 days) + 3000 Coins", done: false },
  { target: 25, reward: "Elite Rank (permanent)", done: false },
];

/* ── Achievements ── */
export const ACHIEVEMENTS: {
  title: string; desc: string; icon: LucideIcon; color: string; progress: number; done: boolean; current?: number; total?: number;
}[] = [
  { title: "First Blood", desc: "Win your first PvP fight", icon: Sword, color: "#f87171", progress: 100, done: true },
  { title: "Builder Pro", desc: "Place 1 million blocks", icon: Map, color: "#fbbf24", progress: 100, done: true },
  { title: "Streak Master", desc: "Log in 14 days in a row", icon: Flame, color: "#fb923c", progress: 50, done: false, current: 7, total: 14 },
  { title: "Social Butterfly", desc: "Invite 5 friends", icon: Users, color: "#38bdf8", progress: 60, done: false, current: 3, total: 5 },
  { title: "Treasure Hunter", desc: "Open 50 crates", icon: Gift, color: "#a855f7", progress: 36, done: false, current: 18, total: 50 },
  { title: "Legend", desc: "Reach level 100", icon: Crown, color: "#facc15", progress: 47, done: false, current: 47, total: 100 },
];

/* ── Quests ── */
// Presentation for each quest, keyed by the backend's stable `key`. Titles are
// localized (Account.quests.items.<key>); mechanics come from the API.
export const QUEST_META: Record<string, { icon: LucideIcon; color: string }> = {
  kill_players: { icon: Sword, color: "#f87171" },
  mine_ores: { icon: Pickaxe, color: "#fbbf24" },
  trade_players: { icon: Users, color: "#38bdf8" },
  login_streak: { icon: Calendar, color: "#a855f7" },
  place_blocks: { icon: Box, color: "#34d399" },
  craft_items: { icon: Hammer, color: "#f59e0b" },
  travel_blocks: { icon: Footprints, color: "#60a5fa" },
  fish_catch: { icon: Fish, color: "#22d3ee" },
  tame_animals: { icon: PawPrint, color: "#fb923c" },
  brew_potions: { icon: FlaskConical, color: "#c084fc" },
  enchant_gear: { icon: Sparkles, color: "#e879f9" },
  defeat_boss: { icon: Skull, color: "#ef4444" },
  harvest_crops: { icon: Wheat, color: "#eab308" },
  complete_dungeon: { icon: DoorOpen, color: "#94a3b8" },
};

export const QUEST_FALLBACK_META = { icon: Target, color: "#94a3b8" };
