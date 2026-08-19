# Archived home layouts

The design handoff shipped three interchangeable heroes behind an A/B/C toggle in
the status bar. **Layout B (centred, orbital ring) is the one in production**, at
`src/components/hero/Hero.tsx`. The toggle is gone; `REPLAY BOOT` stayed.

Everything here is dead code kept for reference — it is outside `src/`, so
TypeScript, ESLint and the bundler all skip it.

| File | What it was |
| --- | --- |
| `HeroA.tsx` | Split hero: display name left, live status panel right. Was the default. |
| `HeroC.tsx` | Dossier card hero, with a four-row vitals column. |
| `StatusPanel.tsx` | Layout A's right-hand panel — vitals, live sync ratio, telemetry strip. |
| `TelemetryStrip.tsx` | The twelve-cell readout inside `StatusPanel`. |
| `layouts.ts` | The `HeroLayout` union and the list the toggle iterated. |
| `useSyncDrift.ts` | Bounded random walk for the sync ratio. Only layout A displayed it. |

## Restoring one

1. Move the files back: heroes and panels to `src/components/hero/`,
   `useSyncDrift.ts` to `src/hooks/`.
2. `StatusPanel.tsx` imports `Bar` from `@/components/ui/Bar` and
   `SYNC_BAR_TRANSITION` from `@/lib/motion` — the latter was deleted when the
   panel left, so re-add it:
   ```ts
   export const SYNC_BAR_TRANSITION: Transition = {
     duration: TIMING.syncBar,
     ease: "linear",
   };
   ```
3. To bring the toggle back, `TerminalSite` needs `useState<HeroLayout>` again and
   `StatusBar` needs the `HOME LAYOUT` button group (see git history, or the
   original prototype at
   `design/mockups/design_handoff_eva_personal_site/Personal Site.dc.html`).
