"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyChromeScale,
  readChromeScale,
  writeChromeScale,
  type ChromeScale,
} from "@/lib/settings";

interface Settings {
  /** How large the fixed chrome is drawn, as a multiple of its 1x size. */
  readonly scale: ChromeScale;
  readonly setScale: (scale: ChromeScale) => void;
}

const SettingsContext = createContext<Settings | null>(null);

/**
 * Holds the visitor's preferences.
 *
 * Mounted in the root layout for the same reason as `JukeboxProvider`: the
 * frame is re-created per route, and a setting that reset itself on the way to
 * `/about` would not be a setting. The panel that writes to it is opened from
 * the nav, so the context has to reach further than the nav does anyway.
 */
export function SettingsProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Read straight out of storage, on the server too — where it answers with
  // the default. Nothing rendered on the server depends on the number (the
  // bars are sized by CSS, and the panel only ever mounts on a click), so the
  // two passes cannot disagree about any markup.
  const [scale, setScaleState] = useState<ChromeScale>(readChromeScale);

  // The document is the external system here, and this keeps it in step with
  // the state. The inline bootstrap in the layout has normally set the same
  // number before the first paint; this is what holds it true afterwards, and
  // the repair if the script never got to run.
  useEffect(() => {
    applyChromeScale(scale);
  }, [scale]);

  const setScale = useCallback((next: ChromeScale) => {
    setScaleState(next);
    writeChromeScale(next);
  }, []);

  const value = useMemo(() => ({ scale, setScale }), [scale, setScale]);

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  const settings = useContext(SettingsContext);
  if (!settings) {
    throw new Error("useSettings must be used inside <SettingsProvider>");
  }
  return settings;
}
