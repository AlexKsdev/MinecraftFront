"use client";

import { useMessages, useTranslations } from "next-intl";

/**
 * An error the API reported. `code` is the server's stable identity for it
 * (e.g. AUTH_INVALID_CODE); `message` is the server's English fallback text.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Turns a thrown error into text to show the user, preferring a translation
 * keyed by the server's error code.
 *
 * An unmapped code falls back to the server's own message rather than a
 * generic line: a newly added code then reads as untranslated English instead
 * of hiding what actually went wrong.
 */
export function useErrorText(): (error: unknown, fallback?: string) => string {
  const t = useTranslations("Auth.errors");
  const messages = useMessages();
  const known = (messages as { Auth?: { errors?: { codes?: object } } })?.Auth
    ?.errors?.codes;

  return (error: unknown, fallback?: string) => {
    // Checked against the loaded messages because next-intl throws on a miss.
    if (error instanceof ApiError && error.code && known && error.code in known) {
      return t(`codes.${error.code}`);
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback ?? t("generic");
  };
}
