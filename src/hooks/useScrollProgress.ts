"use client";

import { useEffect, useState } from "react";

/** Document scroll position as a zero-padded percentage, e.g. `07%`. */
export function useScrollProgress(): string {
  const [progress, setProgress] = useState("00%");

  useEffect(() => {
    const read = () => {
      const root = document.documentElement;
      const travel = Math.max(1, root.scrollHeight - root.clientHeight);
      const pct = Math.round((root.scrollTop / travel) * 100);
      setProgress(`${String(Math.min(100, pct)).padStart(2, "0")}%`);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  return progress;
}
