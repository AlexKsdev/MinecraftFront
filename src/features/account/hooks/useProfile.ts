"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getProfile, UnauthorizedError, type Profile } from "@/lib/account/api";

interface UseProfileResult {
  profile: Profile | null;
  error: string | null;
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
        setError(err instanceof Error ? err.message : t("errorGeneric"));
      });
    return () => {
      active = false;
    };
  }, [router, t]);

  return { profile, error };
}
