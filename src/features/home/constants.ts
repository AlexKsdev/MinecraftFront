export const SERVER_IP = "play.minecraftfront.net";

export const quickLinks = [
  { icon: "🛒", label: "Shop", href: "/shop" },
  { icon: "📖", label: "Blog", href: "/blog" },
  { icon: "📚", label: "Wiki", href: "/wiki" },
  { icon: "👤", label: "Account", href: "/account" },
];

export const stats = [
  { value: "12K+", label: "Players" },
  { value: "99.9%", label: "Uptime" },
  { value: "3+", label: "Years online" },
  { value: "24/7", label: "Support" },
];

export const features = [
  { icon: "⛏️", title: "Survival mode", desc: "Classic hardcore survival with custom terrain generation and rare biomes." },
  { icon: "🛡️", title: "Anti-cheat", desc: "Advanced protection system keeps the game fair for every player." },
  { icon: "👥", title: "Active community", desc: "Thousands of players online. Clans, events, and weekly tournaments." },
  { icon: "⚡", title: "Zero-lag gameplay", desc: "Dedicated high-performance servers with 99.9% uptime guarantee." },
  { icon: "🌲", title: "Custom world", desc: "Unique handcrafted world with hidden dungeons and secret locations." },
  { icon: "⭐", title: "Regular events", desc: "Weekly in-game events with exclusive rewards and rare items." },
];

export const plans = [
  {
    name: "VIP",
    price: "$4.99",
    icon: "🛡️",
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
    icon: "💎",
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
    icon: "👑",
    features: [
      "Everything in Elite",
      "Custom particle effects",
      "Access to creative world",
      "Monthly mystery crate",
    ],
  },
];
