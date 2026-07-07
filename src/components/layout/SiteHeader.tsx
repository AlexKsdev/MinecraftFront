"use client";

import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/account", label: "Account" },
  { href: "/blog", label: "Blog" },
  { href: "/shop", label: "Shop" },
  { href: "/wiki", label: "Wiki" },
];

export function SiteHeader() {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        {NAV_LINKS.map((link) => (
          <Button key={link.href} component={Link} href={link.href}>
            {link.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
