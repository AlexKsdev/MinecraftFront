import { API_URL, clearSession, getSession } from "../auth/api";
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

function extractError(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

/** Public shop catalog. Fetches the full list; the UI filters by category. */
export async function getProducts(): Promise<Product[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/products?limit=100`);
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  if (!res.ok) throw new Error("Failed to load the shop");
  return res.json() as Promise<Product[]>;
}

/** Buy a product with the user's in-game currency. Requires a session. */
export async function purchaseProduct(id: string): Promise<PurchaseResult> {
  const session = getSession();
  if (!session) throw new UnauthorizedError();

  let res: Response;
  try {
    res = await fetch(`${API_URL}/products/${id}/purchase`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  if (res.status === 401) {
    clearSession();
    throw new UnauthorizedError();
  }
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(extractError(data, "Purchase failed"));
  return data as PurchaseResult;
}

/** Public catalog of real-money gem packs. */
export async function getGemPacks(): Promise<GemPack[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/payments/gem-packs`);
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }
  if (!res.ok) throw new Error("Failed to load gem packs");
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
    res = await fetch(`${API_URL}/payments/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ packId }),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  if (res.status === 401) {
    clearSession();
    throw new UnauthorizedError();
  }
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(extractError(data, "Could not start checkout"));
  return data as { url: string; paymentId: string };
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
