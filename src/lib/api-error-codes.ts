/**
 * Stable identities for the failures a player can see outside the auth forms.
 * The client maps these to localized text; the `message` thrown beside them is
 * an English fallback for logs and unmapped clients, never the UI copy.
 *
 * Auth has its own set in `config/error-codes.config.ts` on the server, mirrored
 * by `Auth.errors.codes`. These are the client-side ones, raised by the fetch
 * helpers themselves rather than by the API.
 *
 * Codes are contract: rename one and a translated message silently reverts to
 * the English fallback.
 */
export const API_ERROR_CODES = {
  /** The request never reached the server. */
  network: "API_NETWORK",
  loadFailed: "API_LOAD_FAILED",
  purchaseFailed: "API_PURCHASE_FAILED",
  checkoutFailed: "API_CHECKOUT_FAILED",
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
