import {
  ShoppingBag,
  BookOpen,
  BookMarked,
  MessageSquare,
  User,
  Trophy,
  Pickaxe,
  Shield,
  Users,
  Zap,
  TreePine,
  Star,
  Gem,
  Crown,
} from "lucide-react";

export { SERVER_IP } from "@/constants";

export const quickLinks = [
  { id: "shop", icon: ShoppingBag, href: "/shop", accent: "amber" as const },
  { id: "blog", icon: BookOpen, href: "/blog", accent: "sky" as const },
  { id: "wiki", icon: BookMarked, href: "/wiki", accent: "purple" as const },
  { id: "discord", icon: MessageSquare, href: "#", accent: "indigo" as const },
  { id: "account", icon: User, href: "/account", accent: "primary" as const },
  { id: "topPlayers", icon: Trophy, href: "/wiki", accent: "amber" as const },
];

export const stats = [
  { id: "players", value: "12K+" },
  { id: "uptime", value: "99.9%" },
  { id: "years", value: "3+" },
  { id: "support", value: "24/7" },
];

export const features = [
  { id: "survival", icon: Pickaxe, accent: "amber" as const },
  { id: "anticheat", icon: Shield, accent: "primary" as const },
  { id: "community", icon: Users, accent: "sky" as const },
  { id: "performance", icon: Zap, accent: "yellow" as const },
  { id: "world", icon: TreePine, accent: "green" as const },
  { id: "events", icon: Star, accent: "purple" as const },
];

// `name` and `price` are brand/pricing constants kept untranslated;
// per-plan `features` bullets live in the Home messages namespace (keyed by `id`).
export const plans = [
  { id: "vip", name: "VIP", price: "$4.99", icon: Shield, accent: "amber" as const },
  { id: "elite", name: "Elite", price: "$9.99", icon: Gem, accent: "sky" as const, featured: true },
  { id: "legend", name: "Legend", price: "$19.99", icon: Crown, accent: "purple" as const },
];
