import { Home, Pickaxe, Swords, Shield, Users, Zap } from "lucide-react";

export type CategoryAccent =
  | "primary"
  | "amber"
  | "red"
  | "sky"
  | "purple"
  | "yellow";

export interface WikiArticle {
  title: string;
  desc: string;
}

export interface WikiCategory {
  id: string;
  icon: typeof Home;
  accent: CategoryAccent;
  title: string;
  articles: WikiArticle[];
}

export const categories: WikiCategory[] = [
  {
    id: "getting-started",
    icon: Home,
    accent: "primary",
    title: "Getting Started",
    articles: [
      { title: "How to Join PureCraft", desc: "Step-by-step guide for first-time players." },
      { title: "Server Rules", desc: "Read before playing — know what's allowed." },
      { title: "Starter Guide", desc: "First 30 minutes on the server." },
      { title: "Commands Reference", desc: "All player commands listed." },
    ],
  },
  {
    id: "survival",
    icon: Pickaxe,
    accent: "amber",
    title: "Survival",
    articles: [
      { title: "World Borders & Zones", desc: "Where you can build and explore." },
      { title: "Economy Guide", desc: "Trading, shops, and earning money." },
      { title: "Farming & Resources", desc: "Best spots and farming strategies." },
      { title: "Custom Crafting", desc: "Unique recipes exclusive to PureCraft." },
    ],
  },
  {
    id: "pvp",
    icon: Swords,
    accent: "red",
    title: "PvP",
    articles: [
      { title: "PvP Zones", desc: "Where PvP is enabled and rules." },
      { title: "Arena Guide", desc: "How to join and win arena fights." },
      { title: "Clan Wars", desc: "Organize and battle other clans." },
      { title: "Ranked System", desc: "How the PvP ranking works." },
    ],
  },
  {
    id: "ranks",
    icon: Shield,
    accent: "sky",
    title: "Ranks & Perks",
    articles: [
      { title: "Rank Comparison", desc: "VIP vs Elite vs Legend — full comparison." },
      { title: "How to Upgrade", desc: "Purchasing and applying rank upgrades." },
      { title: "Rank Commands", desc: "All commands unlocked per rank." },
      { title: "Free vs Premium", desc: "What free players get vs premium." },
    ],
  },
  {
    id: "community",
    icon: Users,
    accent: "purple",
    title: "Community",
    articles: [
      { title: "Clans & Teams", desc: "Creating, joining, and managing clans." },
      { title: "Events Calendar", desc: "All upcoming and recurring events." },
      { title: "Staff Team", desc: "Meet the moderators and admins." },
      { title: "Appeals & Reports", desc: "Ban appeals, bug reports, player reports." },
    ],
  },
  {
    id: "technical",
    icon: Zap,
    accent: "yellow",
    title: "Technical",
    articles: [
      { title: "Lag & Performance", desc: "Optimize your game for best experience." },
      { title: "Supported Clients", desc: "Allowed mods and clients." },
      { title: "Plugins List", desc: "Server plugins and what they do." },
      { title: "Data & Privacy", desc: "What data we store and why." },
    ],
  },
];
