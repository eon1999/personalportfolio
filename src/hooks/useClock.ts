"use client";

import { useEffect, useState } from "react";

/**
 * Local wall clock as `HH:MM:SS`, ticking once a second. Starts empty so the
 * server and the first client render agree.
 */
export function useClock(): string {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return clock;
}
