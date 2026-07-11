"use client";

import { useSyncExternalStore } from "react";
import {
  getSessionSnapshot,
  subscribeSession,
  type AuthResponse,
} from "./api";

/** Reactive current session; updates on login/logout (same tab and across tabs). */
export function useSession(): AuthResponse | null {
  return useSyncExternalStore(subscribeSession, getSessionSnapshot, () => null);
}
