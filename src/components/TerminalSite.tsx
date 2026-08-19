"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import { BootOverlay } from "@/components/boot/BootOverlay";
import { ReplayCover } from "@/components/gate/ReplayCover";
import { WelcomeGate } from "@/components/gate/WelcomeGate";
import { SiteFrame } from "@/components/chrome/SiteFrame";
import { Hero } from "@/components/hero/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { RecordSection } from "@/components/sections/RecordSection";
import { WritingSection } from "@/components/sections/WritingSection";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useClock } from "@/hooks/useClock";
import { useReveal } from "@/hooks/useReveal";
import { useScrollLock } from "@/hooks/useScrollLock";
import { hasBeenGated, markGated } from "@/lib/session";

export function TerminalSite() {
  // Returning from a sub-page shouldn't replay the whole cold boot; a reload
  // should. `hasBeenGated` is module state, so it draws exactly that line.
  const [skipBoot] = useState(hasBeenGated);

  const { phase, logs, pct, sync, start, skip, reset } = useBootSequence();
  const { bootVisible, revealed, hideBoot, finish, reset: resetReveal } =
    useReveal(skipBoot);
  const [replaying, setReplaying] = useState(false);
  const bootClock = useClock();

  useScrollLock(!revealed || replaying);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (phase === "idle" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        start();
      } else if (phase === "running" && event.key === "Escape") {
        skip();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, start, skip]);

  const onRevealed = useCallback(() => {
    markGated();
    finish();
  }, [finish]);

  /** Hands the screen back to the terminal once the cover has sealed. */
  const onReplayCovered = useCallback(() => {
    reset();
    resetReveal();
    window.scrollTo(0, 0);
    setReplaying(false);
  }, [reset, resetReveal]);

  return (
    <MotionConfig reducedMotion="user">
      <SiteFrame
        action={
          <button
            type="button"
            onClick={() => setReplaying(true)}
            disabled={replaying}
            className="status-action"
          >
            REPLAY BOOT
          </button>
        }
        render={(clock) => <Hero clock={clock} />}
        overlays={
          <>
            {phase === "done" && !revealed && !replaying ? (
              <WelcomeGate onCovered={hideBoot} onRevealed={onRevealed} />
            ) : null}

            {replaying ? <ReplayCover onCovered={onReplayCovered} /> : null}

            {bootVisible ? (
              <BootOverlay
                phase={phase}
                logs={logs}
                pct={pct}
                sync={sync}
                clock={bootClock}
                onStart={start}
                onSkip={skip}
              />
            ) : null}
          </>
        }
      >
        <AboutSection />
        <ProjectsSection />
        <WritingSection />
        <RecordSection />
        <ContactSection />
      </SiteFrame>
    </MotionConfig>
  );
}
