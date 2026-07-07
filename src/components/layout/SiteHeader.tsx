import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/account", label: "Account" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Shop" },
  { href: "/wiki", label: "Wiki" },
];

export function SiteHeader() {
  return (
    <header className="flex items-center gap-6 border-b px-6 py-4">
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </header>
  );
}
