"use client";

import { createContext, useContext, useRef } from "react";
import { useJukebox, type Jukebox } from "@/hooks/useJukebox";

const JukeboxContext = createContext<Jukebox | null>(null);

/**
 * Owns the one `<audio>` element on the site.
 *
 * Mounted in the root layout rather than in `SiteFrame`, because the frame is
 * re-created per route: playing from the home page and then opening `/writing`
 * would tear the element down mid-track. The layout survives client-side
 * navigation, so the music does too.
 */
export function JukeboxProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // The ref lives here rather than inside the hook: it is wiring for the
  // element below, not state any consumer of the context should see.
  const audioRef = useRef<HTMLAudioElement>(null);
  const jukebox = useJukebox(audioRef);

  return (
    <JukeboxContext.Provider value={jukebox}>
      {children}
      {/* No `src` — `useJukebox` sets it on the first play, so a visitor who
          never presses play never fetches a track. */}
      <audio ref={audioRef} preload="none" />
    </JukeboxContext.Provider>
  );
}

export function useJukeboxContext(): Jukebox {
  const jukebox = useContext(JukeboxContext);
  if (!jukebox) {
    throw new Error("useJukeboxContext must be used inside <JukeboxProvider>");
  }
  return jukebox;
}
