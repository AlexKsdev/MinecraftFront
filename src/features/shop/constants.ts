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
