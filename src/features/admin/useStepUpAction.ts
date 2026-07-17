"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { StepUpRequiredError } from "@/lib/admin/api";
import { stepUp } from "@/lib/auth/api";
import { useErrorText } from "@/lib/auth/errors";

export interface StepUpAction {
  /** Run an admin mutation, parking it for replay if the server wants a factor. */
  run: (action: () => Promise<unknown>) => Promise<void>;
  /** True while a code is owed — render the prompt instead of the buttons. */
  awaitingCode: boolean;
  code: string;
  setCode: (code: string) => void;
  confirm: () => Promise<void>;
  cancel: () => void;
  busy: boolean;
  error: string | null;
}

/**
 * Every admin mutation sits behind StepUpGuard, so any of them can come back
 * demanding a freshly proved factor. Rather than surfacing that as a failure the
 * admin has to recover from by hand, the action is parked and replayed once the
 * code checks out: one prompt, and the original intent still happens.
 *
 * Shared by the user and product tables — the dance is identical, and a second
 * copy would be a second place to get it wrong.
 */
export function useStepUpAction(onDone?: () => void): StepUpAction {
  const router = useRouter();
  const errorText = useErrorText();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<(() => Promise<unknown>) | null>(null);
  const [code, setCode] = useState("");

  function finish() {
    router.refresh();
    onDone?.();
  }

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      finish();
    } catch (err) {
      if (err instanceof StepUpRequiredError) {
        // Stored behind a callback: passing the function straight to setState
        // would have React call it as an updater.
        setPending(() => action);
      } else {
        setError(errorText(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      await stepUp({ code });
      await pending();
      setPending(null);
      setCode("");
      finish();
    } catch (err) {
      setCode("");
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    setPending(null);
    setCode("");
    setError(null);
  }

  return {
    run,
    awaitingCode: pending !== null,
    code,
    setCode,
    confirm,
    cancel,
    busy,
    error,
  };
}
