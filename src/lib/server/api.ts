import { cookies } from "next/headers";

/**
 * Calls the backend from a Server Component, forwarding the caller's cookies so
 * the request carries their session.
 *
 * Talks to BACKEND_URL directly rather than through this app's /api rewrite —
 * that prefix only exists for the browser. BACKEND_URL is server-side only and
 * must never become NEXT_PUBLIC_, or the browser could address the backend
 * directly and the auth cookies would be cross-site again.
 *
 * Importing `next/headers` is itself the guard against this file ending up in a
 * client bundle: it throws at build time if it does.
 */
export async function serverFetch(path: string): Promise<Response> {
  const cookieStore = await cookies();
  return fetch(`${process.env.BACKEND_URL ?? "http://localhost:3000"}${path}`, {
    headers: { cookie: cookieStore.toString() },
    // Session-scoped and always fresh — never cache one user's answer for another.
    cache: "no-store",
  });
}
