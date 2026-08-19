"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** The server can't know, and assuming motion keeps the markup stable. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether the visitor has asked for less movement, readable during render.
 *
 * `@/lib/prefs` answers the same question, but only from inside an effect;
 * this is for the cases where the preference decides what gets rendered at
 * all, rather than what gets animated afterwards.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
