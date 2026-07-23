import { clearSession, getSession } from "../auth/api";
import { apiFetch } from "../http";
import { API_ERROR_CODES } from "../api-error-codes";
import { ApiError } from "../auth/errors";
import { UnauthorizedError } from "../account/api";

export type Currency = "COINS" | "GEMS";

export interface Product {
  id: string;
  slug: string;
  category: string;
  name: string;
  emoji: string;
  rarity: string;
  currency: Currency;
  price: number;
  badge: string | null;
  stats: string[];
}

export interface PurchaseResult {
  id: string;
  currency: Currency;
  price: number;
  createdAt: string;
  product: { id: string; slug: string; name: string; emoji: string };
  /** Balances after the purchase. */
  coins: number;
  gems: number;
}

export interface GemPack {
  id: string;
  name: string;
  gems: number;
  priceCents: number;
}

export type ProductSort =
  | "coins_asc"
  | "coins_desc"
  | "gems_asc"
  | "gems_desc"
  | "rarity_asc"
  | "rarity_desc";

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  sort?: ProductSort;
}

function extractError(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

/** Public shop catalog — server-side paginated, filtered and sorted. */
export async function getProducts(
  query: ProductQuery = {},
): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.category && query.category !== "All") {
    params.set("category", query.category);
  }
  if (query.sort) params.set("sort", query.sort);

  let res: Response;
  try {
    res = await apiFetch(`/products?${params.toString()}`);
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please try again.",
      API_ERROR_CODES.network,
    );
  }
  if (!res.ok)
    throw new ApiError("Failed to load the shop", API_ERROR_CODES.loadFailed);
  return res.json() as Promise<PaginatedProducts>;
}

/** Buy a product with the user's in-game currency. Requires a session. */
export async function purchaseProduct(id: string): Promise<PurchaseResult> {
  const session = getSession();
  if (!session) throw new UnauthorizedError();

  let res: Response;
  try {
    res = await apiFetch(`/products/${id}/purchase`, { method: "POST" });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please try again.",
      API_ERROR_CODES.network,
    );
  }

  if (res.status === 401) {
    clearSession();
    throw new UnauthorizedError();
  }
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      extractError(data, "Purchase failed"),
      API_ERROR_CODES.purchaseFailed,
    );
  return data as PurchaseResult;
}

/** Public catalog of real-money gem packs. */
export async function getGemPacks(): Promise<GemPack[]> {
  let res: Response;
  try {
    res = await apiFetch("/payments/gem-packs");
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please try again.",
      API_ERROR_CODES.network,
    );
  }
  if (!res.ok)
    throw new ApiError(
      "Failed to load gem packs",
      API_ERROR_CODES.loadFailed,
    );
  return res.json() as Promise<GemPack[]>;
}

/** Start a Stripe checkout for a gem pack; returns the hosted checkout URL. */
export async function createCheckout(
  packId: string,
): Promise<{ url: string; paymentId: string }> {
  const session = getSession();
  if (!session) throw new UnauthorizedError();

  let res: Response;
  try {
    res = await apiFetch("/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packId }),
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Please try again.",
      API_ERROR_CODES.network,
    );
  }

  if (res.status === 401) {
    clearSession();
    throw new UnauthorizedError();
  }
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      extractError(data, "Could not start checkout"),
      API_ERROR_CODES.checkoutFailed,
    );
  return data as { url: string; paymentId: string };
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
