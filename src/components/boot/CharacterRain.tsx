"use client";

import { useEffect, useRef, useState } from "react";

/** How long the rain falls at full strength before it starts to clear. */
const RAIN_MS = 1100;
/** Fade-out, kept in step with the CSS transition below. */
const FADE_MS = 420;
/** A visitor who asked for less motion still gets the beat, without the rain. */
const REDUCED_HOLD_MS = 260;
/** Columns are this many pixels apart. */
const COLUMN_PX = 16;
/** Characters trailing behind each column head, dimming as they go. */
const TRAIL = 6;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

interface Column {
  /** Head position, in rows. */
  y: number;
  /** Rows per frame. */
  speed: number;
  glyphs: readonly string[];
}

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Heads are spread across the whole column, above the fold and below it, so the
 * first painted frame already covers the screen. Starting them all off the top
 * would mean the standby panel underneath stays legible for half the wipe.
 */
function buildColumns(count: number, rows: number): Column[] {
  return Array.from({ length: count }, () => ({
    y: -TRAIL + Math.random() * (rows + TRAIL),
    speed: 0.25 + Math.random() * 0.55,
    glyphs: Array.from({ length: TRAIL }, randomGlyph),
  }));
}

interface CharacterRainProps {
  /** Fires once the rain has faded out and stopped painting. */
  readonly onComplete: () => void;
}

/**
 * A brief fall of characters over the boot panel, covering the hand-off from
 * standby into the running sequence. Paints to its own canvas and reports back
 * when it is spent, so the caller can unmount it.
 */
export function CharacterRain({ onComplete }: CharacterRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fading, setFading] = useState(false);

  // Read through a ref so a caller passing a fresh callback each render cannot
  // restart the animation midway. Declared first so the ref is current before
  // the animation effect below ever reads it.
  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      completeRef.current();
      return;
    }

    // Nothing here reads as information, so for a visitor who has asked for
    // less motion the rain is skipped — but the beat is still held, so the
    // panel does not snap in on top of the standby screen's exit.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const held = setTimeout(() => completeRef.current(), REDUCED_HOLD_MS);
      return () => clearTimeout(held);
    }

    // Canvas resolves neither CSS custom properties nor `var()` in `font`, so
    // both are read off the document once, up front.
    const rootStyle = getComputedStyle(document.documentElement);
    const accent = rootStyle.getPropertyValue("--color-ac").trim() || "#9fe8c8";
    const mono =
      rootStyle.getPropertyValue("--font-jetbrains-mono").trim() || "monospace";

    let columns: Column[] = [];
    let rows = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${COLUMN_PX - 3}px ${mono}, monospace`;
      ctx.textBaseline = "top";

      rows = Math.ceil(height / COLUMN_PX) + TRAIL;
      columns = buildColumns(Math.ceil(width / COLUMN_PX), rows);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!running) return;

      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = accent;

      columns.forEach((column, index) => {
        column.y += column.speed;
        if (column.y - TRAIL > rows) column.y = -TRAIL;

        for (let step = 0; step < TRAIL; step += 1) {
          const y = Math.floor(column.y - step) * COLUMN_PX;
          if (y < -COLUMN_PX || y > height) continue;

          ctx.globalAlpha = (1 - step / TRAIL) * 0.75;
          ctx.fillText(column.glyphs[step], index * COLUMN_PX, y);
        }
      });

      ctx.globalAlpha = 1;

      // Churn a single column's glyphs per frame — enough to keep the field
      // alive without redrawing the whole alphabet every tick.
      const churn = columns[frame % Math.max(1, columns.length)];
      if (churn) churn.glyphs = Array.from({ length: TRAIL }, randomGlyph);
      frame += 1;

      raf = requestAnimationFrame(draw);
    };

    let raf = requestAnimationFrame(draw);

    const fadeTimer = setTimeout(() => setFading(true), RAIN_MS);
    const doneTimer = setTimeout(() => {
      running = false;
      cancelAnimationFrame(raf);
      completeRef.current();
    }, RAIN_MS + FADE_MS);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    />
  );
}
