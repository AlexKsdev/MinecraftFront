export type TagAccent = "primary" | "amber" | "sky" | "purple" | "yellow";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: string;
  tagAccent: TagAccent;
  image: string;
  readTime: string;
}

export const posts: BlogPost[] = [
  {
    id: 1,
    title: "Season 5 Update: New Biomes & Dungeons",
    excerpt:
      "Season 5 brings massive world changes — explore 3 new biomes, 12 new dungeons, and the long-awaited End realm expansion.",
    date: "Dec 20, 2024",
    author: "PureCraft Staff",
    tag: "Update",
    tagAccent: "primary",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=70",
    readTime: "4 min",
  },
  {
    id: 2,
    title: "Holiday Event: Festive Build Contest 2024",
    excerpt:
      "Join our annual holiday build contest! Best festive builds win exclusive cosmetics, in-game currency, and real prizes.",
    date: "Dec 15, 2024",
    author: "Events Team",
    tag: "Event",
    tagAccent: "amber",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=70",
    readTime: "2 min",
  },
  {
    id: 3,
    title: "Anti-Cheat 3.0: A Fairer PureCraft",
    excerpt:
      "We've completely rewritten our anti-cheat system. Here's what changed, what we detect, and how we keep the game fair.",
    date: "Dec 10, 2024",
    author: "Dev Team",
    tag: "Dev Blog",
    tagAccent: "sky",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Meet the Staff: Interview with ModeratorX",
    excerpt:
      "We sat down with one of our longest-serving moderators to talk about the server, community, and what makes PureCraft special.",
    date: "Dec 5, 2024",
    author: "Community Team",
    tag: "Community",
    tagAccent: "purple",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=70",
    readTime: "5 min",
  },
  {
    id: 5,
    title: "Economy Rebalance: Prices & Trades Updated",
    excerpt:
      "After months of community feedback, we've rebalanced the entire server economy. Here's the full breakdown of what changed.",
    date: "Nov 28, 2024",
    author: "PureCraft Staff",
    tag: "Update",
    tagAccent: "primary",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=600&q=70",
    readTime: "7 min",
  },
  {
    id: 6,
    title: "Top 10 Starter Tips for New Players",
    excerpt:
      "Just joined PureCraft? Here are 10 essential tips to get you started — from finding a base location to your first trade.",
    date: "Nov 20, 2024",
    author: "Community Team",
    tag: "Guide",
    tagAccent: "yellow",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=70",
    readTime: "8 min",
  },
];
