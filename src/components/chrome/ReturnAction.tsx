"use client";

import { useCallback, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReplayCover } from "@/components/gate/ReplayCover";
import { useScrollLock } from "@/hooks/useScrollLock";
import { markHandback } from "@/lib/session";

/**
 * Sub-page counterpart to `REPLAY BOOT`, and it runs the same cover: tiles
 * scatter shut from the edges in, then a backing seals the seams.
 *
 * The route swap waits for that seal, so the navigation happens behind full
 * black rather than cutting mid-animation; `ReturnGate` picks the same black up
 * on the home page and ripples it open onto the site.
 */
export function ReturnAction() {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  useScrollLock(returning);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // Modified clicks belong to the browser — new tab, new window, save.
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      if (returning) return;
      setReturning(true);
    },
    [returning],
  );

  /** The screen is sealed black — swap the route underneath it. */
  const onCovered = useCallback(() => {
    // Flagged before the push, so the home page's first render already knows to
    // come up covered and finish the transition rather than snapping in.
    markHandback();
    router.push("/");
  }, [router]);

  return (
    <>
      <Link
        href="/"
        onClick={onClick}
        aria-disabled={returning || undefined}
        className="status-action"
      >
        ← RETURN TO TERMINAL
      </Link>

      {/* Portalled out of the status bar: that bar carries a z-index of its
          own, and a cover nested inside it would be stacked at the bar's level
          rather than over the whole page. */}
      {returning
        ? createPortal(<ReplayCover onCovered={onCovered} />, document.body)
        : null}
    </>
  );
}
