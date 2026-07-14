"use client";

import { useEffect, useState } from "react";
import type { PaymentBanner } from "../types";

function readPaymentBanner(): PaymentBanner {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("payment");
  return value === "success" || value === "cancelled" ? value : null;
}

/**
 * Reads the ?payment= flag Stripe appends on redirect. It is only readable on
 * the client, so the banner is set in an effect after mount.
 */
export function usePaymentBanner() {
  const [banner, setBanner] = useState<PaymentBanner>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBanner(readPaymentBanner());
  }, []);

  return { banner, setBanner };
}
