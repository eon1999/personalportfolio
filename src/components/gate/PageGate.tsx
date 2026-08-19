"use client";

import { useCallback, useState } from "react";
import { markGated } from "@/lib/session";
import { useScrollLock } from "@/hooks/useScrollLock";
import { AccessGate } from "./AccessGate";

/**
 * Wraps a sub-page so it arrives behind an access gate. The gate is opaque on
 * first paint — including server-side — so the route never flashes before the
 * sequence starts.
 */
export function PageGate({ children }: { readonly children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  const finish = useCallback(() => {
    markGated();
    setRevealed(true);
  }, []);

  useScrollLock(!revealed);

  return (
    <>
      {children}
      {revealed ? null : <AccessGate onRevealed={finish} />}
    </>
  );
}
