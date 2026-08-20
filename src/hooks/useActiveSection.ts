"use client";

import { useEffect, useState } from "react";

/**
 * Where down the viewport a section stops being the one coming up and starts
 * being the one being read. A fraction rather than a pixel offset, so it does
 * not have to be retuned every time the chrome is rescaled.
 */
const READING_LINE = 0.3;

/**
 * Which of `ids` the visitor is currently in, by document order — the last one
 * whose top has crossed the reading line.
 *
 * `null` means there was nothing to watch: on a sub-page none of the home
 * page's sections are mounted, and the caller has something better to show
 * than a guess.
 */
export function useActiveSection(ids: readonly string[]): number | null {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const read = () => {
      const root = document.documentElement;
      const line = window.innerHeight * READING_LINE;
      let mounted = false;
      let current = 0;
      let last = 0;

      ids.forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section) return;

        mounted = true;
        last = index;
        if (section.getBoundingClientRect().top <= line) current = index;
      });

      // The bottom of the document is the end of the list, whatever the
      // reading line says. The last section plus the footer is shorter than
      // the run-out below the line, so it can never climb past it — and once
      // there is nothing under it, it is plainly the one being read.
      const atBottom =
        root.scrollTop + root.clientHeight >= root.scrollHeight - 2;

      setActive(mounted ? (atBottom ? last : current) : null);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [ids]);

  return active;
}
