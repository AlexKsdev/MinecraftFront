"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getProfile, UnauthorizedError } from "@/lib/account/api";
import { publishBalances } from "@/lib/account/balances";
import { getGemPacks, createCheckout, type GemPack } from "@/lib/shop/api";
import type { PaymentBanner } from "../types";

interface UseGemCheckoutArgs {
  setError: (message: string | null) => void;
  setBanner: (banner: PaymentBanner) => void;
}

/**
 * Loads the gem packs and current balances on mount, and drives the Stripe
 * checkout redirect. A checkout failure is surfaced through the shared error
 * slot (owned by useProducts), matching the original single-error behavior.
 */
export function useGemCheckout({ setError, setBanner }: UseGemCheckoutArgs) {
  const t = useTranslations("Shop");
  const [packs, setPacks] = useState<GemPack[]>([]);
  const [checkoutPack, setCheckoutPack] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getGemPacks()
      .then((list) => active && setPacks(list))
      .catch(() => {});

    getProfile()
      .then((p) => active && publishBalances({ coins: p.coins, gems: p.gems }))
      .catch((err: unknown) => {
        if (!active || err instanceof UnauthorizedError) return;
      });

    return () => {
      active = false;
    };
  }, []);

  async function buyGems(pack: GemPack) {
    setCheckoutPack(pack.id);
    try {
      const { url } = await createCheckout(pack.id);
      window.location.assign(url);
    } catch (err: unknown) {
      setCheckoutPack(null);
      setBanner(null);
      setError(
        err instanceof UnauthorizedError
          ? t("errors.signInToBuyGems")
          : err instanceof Error
            ? err.message
            : t("errors.checkoutFailed"),
      );
    }
  }

  return { packs, checkoutPack, buyGems };
}
