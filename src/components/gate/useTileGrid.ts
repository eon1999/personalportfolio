"use client";

import { useMemo, useSyncExternalStore } from "react";
import { measureTileGrid, type TileGridSize } from "@/lib/gate";

/**
 * Deliberately subscribes to nothing: the grid is snapshotted when the gate
 * mounts and held for its lifetime, so a mid-animation resize can't re-tile the
 * cover out from under a running timeline.
 */
function subscribe() {
  return () => {};
}

function getSnapshot(): string {
  return `${window.innerWidth}x${window.innerHeight}`;
}

function getServerSnapshot(): string | null {
  return null;
}

/**
 * The tile grid covering the viewport, or `null` on the server and during
 * hydration — gates render a plain solid backing until this resolves.
 */
export function useTileGrid(): TileGridSize | null {
  const measurement = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    if (measurement === null) return null;
    const [width, height] = measurement.split("x").map(Number);
    return measureTileGrid(width, height);
  }, [measurement]);
}
