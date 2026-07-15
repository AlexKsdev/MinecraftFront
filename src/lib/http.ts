"use client";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Calls the API through this origin's /api proxy, so auth rides on first-party
 * httpOnly cookies. Nothing here reads or stores a token — there isn't one to
 * read. Mutations echo the readable CSRF cookie back in a header (double-submit).
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (!SAFE_METHODS.has(method)) {
    const csrf = readCookie("pc_csrf");
    if (csrf) headers.set("x-csrf-token", csrf);
  }
  return fetch(`/api${path}`, { ...init, headers, credentials: "include" });
}
