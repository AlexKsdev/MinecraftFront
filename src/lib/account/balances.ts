"use client";

import { useSyncExternalStore } from "react";

export interface Balances {
  coins: number;
  gems: number;
}

// Module-level store so the shop and the header account menu share one source
// of truth for the user's balances and update together, no reload needed.
let current: Balances | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Set the latest balances (from a profile fetch or a purchase response). */
export function publishBalances(next: Balances): void {
  current = next;
  emit();
}

export function clearBalances(): void {
  current = null;
  emit();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Balances | null {
  return current;
}

/** Reactive shared balances; null until the first profile/purchase publishes. */
export function useBalances(): Balances | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
