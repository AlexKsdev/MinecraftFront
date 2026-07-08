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
  { icon: ShoppingBag, label: "Shop", href: "/shop", accent: "amber" as const },
  { icon: BookOpen, label: "Blog", href: "/blog", accent: "sky" as const },
  { icon: BookMarked, label: "Wiki", href: "/wiki", accent: "purple" as const },
  { icon: MessageSquare, label: "Discord", href: "/discord", accent: "indigo" as const },
  { icon: User, label: "Account", href: "/account", accent: "primary" as const },
  { icon: Trophy, label: "Top Players", href: "/wiki", accent: "amber" as const },
];

export const stats = [
  { value: "12K+", label: "Players" },
  { value: "99.9%", label: "Uptime" },
  { value: "3+", label: "Years online" },
  { value: "24/7", label: "Support" },
];

export const features = [
  { icon: Pickaxe, title: "Survival mode", desc: "Classic hardcore survival with custom terrain generation and rare biomes." },
  { icon: Shield, title: "Anti-cheat", desc: "Advanced protection system keeps the game fair for every player." },
  { icon: Users, title: "Active community", desc: "Thousands of players online. Clans, events, and weekly tournaments." },
  { icon: Zap, title: "Zero-lag gameplay", desc: "Dedicated high-performance servers with 99.9% uptime guarantee." },
  { icon: TreePine, title: "Custom world", desc: "Unique handcrafted world with hidden dungeons and secret locations." },
  { icon: Star, title: "Regular events", desc: "Weekly in-game events with exclusive rewards and rare items." },
];

export const plans = [
  {
    name: "VIP",
    price: "$4.99",
    icon: Shield,
    features: [
      "Custom /nick command",
      "Access to VIP lounge",
      "2x vote rewards",
      "Colored chat prefix [VIP]",
    ],
  },
  {
    name: "Elite",
    price: "$9.99",
    icon: Gem,
    featured: true,
    features: [
      "Everything in VIP",
      "Fly in survival world",
      "Custom join/leave messages",
      "Priority queue",
    ],
  },
  {
    name: "Legend",
    price: "$19.99",
    icon: Crown,
    features: [
      "Everything in Elite",
      "Custom particle effects",
      "Access to creative world",
      "Monthly mystery crate",
    ],
  },
];
