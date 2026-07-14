import type { SortOption } from "./types";

export const PAGE_SIZE = 6;

// Products load fast enough locally that the skeleton can flash on and off
// within a few dozen ms, which reads as flicker rather than "loading". This
// floor makes the loading state visible for at least this long — but never
// adds delay on top of a response that's already slower than it.
export const MIN_LOADING_MS = 400;

export const SORT_OPTIONS: SortOption[] = [
  { value: "", id: "featured" },
  { value: "coins_asc", id: "coinsAsc" },
  { value: "coins_desc", id: "coinsDesc" },
  { value: "gems_asc", id: "gemsAsc" },
  { value: "gems_desc", id: "gemsDesc" },
  { value: "rarity_desc", id: "rarityDesc" },
  { value: "rarity_asc", id: "rarityAsc" },
];

// `value` is sent to the API and must stay in English; `id` keys the Shop
// messages namespace for the display label.
export const categories = [
  { value: "All", id: "all" },
  { value: "Weapons", id: "weapons" },
  { value: "Armor", id: "armor" },
  { value: "Tools", id: "tools" },
  { value: "Resources", id: "resources" },
  { value: "Food", id: "food" },
  { value: "Potions", id: "potions" },
] as const;

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

// Rarity display labels live in the Shop messages namespace (keyed by lowercased
// rarity); only the style accent is kept here.
export const RARITY: Record<Rarity, { accent: string }> = {
  Common: { accent: "common" },
  Uncommon: { accent: "uncommon" },
  Rare: { accent: "rare" },
  Epic: { accent: "epic" },
  Legendary: { accent: "legendary" },
};
