"use client";

import { useEffect, useState } from "react";
import { ELAPSED_ZERO, formatElapsed, sessionElapsed } from "@/lib/session-clock";

/**
 * Time connected as `HH:MM:SS`, ticking once a second. Starts at zero so the
 * server and the first client render agree.
 */
export function useSessionTimer(): string {
  const [elapsed, setElapsed] = useState(ELAPSED_ZERO);

  useEffect(() => {
    const tick = () => setElapsed(formatElapsed(sessionElapsed()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return elapsed;
}
