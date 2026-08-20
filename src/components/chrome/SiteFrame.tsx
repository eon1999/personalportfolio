"use client";

import { useRef } from "react";
import { useClock } from "@/hooks/useClock";
import { useScatter } from "@/hooks/useScatter";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { CursorReticle } from "./CursorReticle";
import { HudFrame } from "./HudFrame";
import { MonitorOverlay } from "./MonitorOverlay";
import { SiteFooter } from "./SiteFooter";
import { StatusBar } from "./StatusBar";
import { TopNav } from "./TopNav";

interface SiteFrameProps {
  /** Rendered inside the content column. */
  readonly children: React.ReactNode;
  /** Right-hand slot in the bottom status bar. */
  readonly action?: React.ReactNode;
  /** Optional sync value (0–64.7) to display in the status bar. */
  readonly syncValue?: number;
  /** Full-screen gates, layered above the chrome. */
  readonly overlays?: React.ReactNode;
  /** Receives the live clock, for anything in the content that wants it. */
  readonly render?: (clock: string) => React.ReactNode;
}

/**
 * Fixed chrome shared by the home page and every sub-page: scanlines, top nav,
 * the content column, footer and status bar.
 */
export function SiteFrame({
  children,
  action,
  syncValue,
  overlays,
  render,
}: SiteFrameProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const clock = useClock();
  const scrollProgress = useScrollProgress();

  useScatter(bodyRef);

  return (
    // Bottom padding clears the fixed status bar, at whatever size it is
    // currently drawn.
    <div className="relative min-h-screen bg-bg pb-[var(--status-h)]">
      <MonitorOverlay />
      <HudFrame />
      <TopNav />

      {/* Everything below the chrome dims behind the project dossier. */}
      <div ref={bodyRef} className="page-body">
        <main className="mx-auto max-w-[1180px] px-7 pt-[var(--nav-h)]">
          {render ? render(clock) : null}
          {children}
        </main>

        <SiteFooter clock={clock} />
      </div>

      <StatusBar scrollProgress={scrollProgress} syncValue={syncValue}>
        {action}
      </StatusBar>

      {overlays}
      <CursorReticle />
    </div>
  );
}
