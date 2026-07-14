"use client";

import { useEffect, useState } from "react";
import type { Toast } from "../types";

const TOAST_DURATION_MS = 3500;

/** A single auto-dismissing toast; showToast replaces any current one. */
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(text: string, ok: boolean) {
    setToast({ text, ok });
  }

  return { toast, showToast };
}
