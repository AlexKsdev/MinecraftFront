import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
  // Proxy the API through this origin so the browser only ever talks to one
  // site: auth cookies are then first-party and SameSite applies, no matter
  // where the backend is actually hosted. BACKEND_URL is server-side only —
  // it must never be NEXT_PUBLIC_, or the browser could address the backend
  // directly and the cookies would be cross-site again.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:3000"}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
