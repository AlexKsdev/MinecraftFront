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

export interface ShopItem {
  id: number;
  category: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  price: string;
  badge?: string;
  stats: string[];
}

export const items: ShopItem[] = [
  // Weapons
  { id: 1, category: "Weapons", name: "Diamond Sword", emoji: "⚔️", rarity: "Rare", price: "1,200", stats: ["Sharpness IV", "Looting II", "Unbreaking III"] },
  { id: 2, category: "Weapons", name: "Netherite Sword", emoji: "🗡️", rarity: "Legendary", price: "4,800", badge: "HOT", stats: ["Sharpness V", "Fire Aspect II", "Looting III", "Unbreaking III"] },
  { id: 3, category: "Weapons", name: "Power Bow", emoji: "🏹", rarity: "Epic", price: "2,500", stats: ["Power V", "Flame I", "Infinity I", "Punch II"] },
  { id: 4, category: "Weapons", name: "Iron Axe", emoji: "🪓", rarity: "Common", price: "300", stats: ["Sharpness II", "Unbreaking II"] },
  { id: 5, category: "Weapons", name: "Trident", emoji: "🔱", rarity: "Epic", price: "3,000", badge: "NEW", stats: ["Riptide III", "Loyalty II", "Channeling I"] },
  { id: 6, category: "Weapons", name: "Crossbow", emoji: "🎯", rarity: "Uncommon", price: "800", stats: ["Multishot I", "Quick Charge III", "Unbreaking II"] },

  // Armor
  { id: 7, category: "Armor", name: "Diamond Chestplate", emoji: "🛡️", rarity: "Rare", price: "1,500", stats: ["Protection IV", "Unbreaking III"] },
  { id: 8, category: "Armor", name: "Netherite Helmet", emoji: "⛑️", rarity: "Legendary", price: "2,800", stats: ["Protection IV", "Respiration III", "Aqua Affinity I"] },
  { id: 9, category: "Armor", name: "Elytra", emoji: "🪽", rarity: "Legendary", price: "6,000", badge: "RARE", stats: ["Unbreaking III", "Mending I", "Pre-charged"] },
  { id: 10, category: "Armor", name: "Leather Boots", emoji: "👟", rarity: "Common", price: "200", stats: ["Feather Falling II", "Depth Strider I"] },
  { id: 11, category: "Armor", name: "Iron Leggings", emoji: "🦵", rarity: "Uncommon", price: "700", stats: ["Protection III", "Unbreaking II"] },

  // Tools
  { id: 12, category: "Tools", name: "Diamond Pickaxe", emoji: "⛏️", rarity: "Rare", price: "1,100", stats: ["Fortune III", "Efficiency V", "Unbreaking III"] },
  { id: 13, category: "Tools", name: "Netherite Pickaxe", emoji: "⛏️", rarity: "Legendary", price: "4,200", badge: "BEST", stats: ["Efficiency V", "Fortune III", "Mending I", "Unbreaking III"] },
  { id: 14, category: "Tools", name: "Silk Touch Shovel", emoji: "🪣", rarity: "Uncommon", price: "600", stats: ["Silk Touch I", "Efficiency IV"] },
  { id: 15, category: "Tools", name: "Fishing Rod", emoji: "🎣", rarity: "Uncommon", price: "500", stats: ["Luck of the Sea III", "Lure III", "Unbreaking II"] },
  { id: 16, category: "Tools", name: "Flint and Steel", emoji: "🔥", rarity: "Common", price: "150", stats: ["Unbreaking II"] },

  // Resources
  { id: 17, category: "Resources", name: "Diamond Bundle (x64)", emoji: "💎", rarity: "Rare", price: "900", stats: ["64x Diamonds", "Instant delivery"] },
  { id: 18, category: "Resources", name: "Netherite Ingots (x4)", emoji: "🟫", rarity: "Epic", price: "2,000", badge: "VALUE", stats: ["4x Netherite Ingots", "Bulk discount"] },
  { id: 19, category: "Resources", name: "Iron Bundle (x256)", emoji: "🔩", rarity: "Common", price: "250", stats: ["256x Iron Ingots"] },
  { id: 20, category: "Resources", name: "Obsidian Pack (x64)", emoji: "🖤", rarity: "Uncommon", price: "400", stats: ["64x Obsidian", "Perfect for bases"] },
  { id: 21, category: "Resources", name: "Ancient Debris (x8)", emoji: "🪨", rarity: "Epic", price: "1,800", stats: ["8x Ancient Debris", "Nether origin"] },

  // Food
  { id: 22, category: "Food", name: "Golden Apple (x16)", emoji: "🍎", rarity: "Rare", price: "700", stats: ["Regeneration II (5s)", "Absorption I (2min)", "16x stack"] },
  { id: 23, category: "Food", name: "Enchanted Golden Apple", emoji: "✨", rarity: "Legendary", price: "3,500", badge: "OP", stats: ["Regeneration II (20s)", "Absorption IV (2min)", "Fire Resistance (5min)"] },
  { id: 24, category: "Food", name: "Steak Bundle (x64)", emoji: "🥩", rarity: "Common", price: "180", stats: ["64x Cooked Beef", "Restores 8 hunger"] },
  { id: 25, category: "Food", name: "Golden Carrot (x32)", emoji: "🥕", rarity: "Uncommon", price: "450", stats: ["Best saturation food", "Night Vision Potions base"] },
  { id: 26, category: "Food", name: "Bread Bundle (x32)", emoji: "🍞", rarity: "Common", price: "100", stats: ["32x Bread", "Easy to stack"] },

  // Potions
  { id: 27, category: "Potions", name: "Strength Potion II", emoji: "💪", rarity: "Uncommon", price: "550", stats: ["Strength II (1:30)", "3-pack included"] },
  { id: 28, category: "Potions", name: "Invisibility Potion", emoji: "👁️", rarity: "Rare", price: "950", stats: ["Invisibility (3:00)", "Perfect for PvP"] },
  { id: 29, category: "Potions", name: "Healing Splash Pack", emoji: "🧪", rarity: "Uncommon", price: "600", stats: ["Instant Health II", "Splash type", "5-pack included"] },
  { id: 30, category: "Potions", name: "Speed Potion II", emoji: "⚡", rarity: "Common", price: "300", stats: ["Speed II (1:30)", "3-pack included"] },
  { id: 31, category: "Potions", name: "Fire Resistance Potion", emoji: "🔥", rarity: "Uncommon", price: "480", stats: ["Fire Resistance (3:00)", "Nether essential"] },
  { id: 32, category: "Potions", name: "Night Vision Pack", emoji: "🌙", rarity: "Common", price: "250", stats: ["Night Vision (3:00)", "4-pack included"] },
];
