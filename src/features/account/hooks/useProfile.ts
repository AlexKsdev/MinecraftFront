"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getProfile, UnauthorizedError, type Profile } from "@/lib/account/api";
import { API_ERROR_CODES } from "@/lib/api-error-codes";
import { ApiError } from "@/lib/auth/errors";

interface UseProfileResult {
  profile: Profile | null;
  error: string | null;
}

/**
 * Localizes a failure by the code the API layer tagged it with. An unmapped
 * error keeps its own message rather than a generic line, so something new
 * reads as untranslated English instead of hiding what went wrong.
 */
function errorText(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.code === API_ERROR_CODES.network) return t("errors.network");
    if (err.code === API_ERROR_CODES.loadFailed) return t("errors.loadFailed");
  }
  if (err instanceof Error && err.message) return err.message;
  return t("errorGeneric");
}

/**
 * Loads the current user's profile once on mount. Redirects to home when the
 * session is missing/rejected; surfaces any other failure as an error message.
 */
export function useProfile(): UseProfileResult {
  const t = useTranslations("Account");
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof UnauthorizedError) {
          router.replace("/");
          return;
        }
        setError(errorText(err, t));
      });
    return () => {
      active = false;
    };
  }, [router, t]);

  return { profile, error };
}
