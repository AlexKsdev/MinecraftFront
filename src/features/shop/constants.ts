export const categories = [
  "All",
  "Weapons",
  "Armor",
  "Tools",
  "Resources",
  "Food",
  "Potions",
] as const;

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export const RARITY: Record<Rarity, { label: string; accent: string }> = {
  Common: { label: "Common", accent: "common" },
  Uncommon: { label: "Uncommon", accent: "uncommon" },
  Rare: { label: "Rare", accent: "rare" },
  Epic: { label: "Epic", accent: "epic" },
  Legendary: { label: "Legendary", accent: "legendary" },
};
