import type { ProductSort } from "@/lib/shop/api";

/** State of the banner shown after a Stripe checkout redirect (?payment=…). */
export type PaymentBanner = "success" | "cancelled" | null;

/** A selectable sort option: empty value = "featured" (no sort param sent). */
export interface SortOption {
  value: "" | ProductSort;
  id: string;
}

/** Transient toast message shown after a purchase (or a purchase error). */
export interface Toast {
  text: string;
  ok: boolean;
}
