# V. DANG — TERMINAL 001

Personal site for Viet-Anh Dang, built from the mecha-terminal design handoff in
`design/mockups/`. Next.js App Router, TypeScript, Tailwind v4, Motion for the
site and boot terminal, anime.js for the reveal.

```bash
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## Routes

| Route | |
| --- | --- |
| `/` | Boot gate then the one-pager. About and Writing show previews. |
| `/about` | Full about record, current postings, contact. |
| `/writing` | Every entry. Empty until something is published. |

Sub-pages arrive behind an access gate and link back with `RETURN TO TERMINAL`.

## Shape of it

```
src/
  app/            layout (fonts, metadata), the three routes, globals.css (tokens)
  components/
    TerminalSite  home client root — boot phase, reveal, replay, scroll locks
    boot/         STANDBY panel, insignia, log readout, sweep band
    gate/         the three full-screen transitions + shared tile primitives
    chrome/       SiteFrame, fixed nav, status bar, footer, scanlines
    hero/         the home hero
    sections/     about, projects, writing feed, record, contact, page header
    settings/     the gear card — chrome scale, and whatever comes next
    ui/           shared primitives
  data/           all copy, the boot log script, gate copy
  hooks/          clock, scroll progress, scroll lock, boot sequence, reveal state
  lib/            gate cues, standby keyframes, motion timings, prefs, session
design/
  mockups/        the original handoff (prototype HTML, README, resume PDF)
  archive/        home layouts that didn't ship — see its README
```

## Animation

Two libraries, split by job.

**anime.js** owns the standby panel and every full-screen gate:

- `boot/Insignia` — three orbitals turning clockwise / counter-clockwise /
  clockwise around a triangle in a pulsing aura, all stroked with a fiery
  gradient. Geometry and speeds are in `src/lib/standby.ts`.
- `boot/BootStandby` — the panel flickers up out of black on mount, so both a
  fresh load and a `REPLAY BOOT` strike a few times before the picture holds.
- `gate/WelcomeGate` — boot to home. Covers the terminal, draws a ring closed
  around `WELCOME OPERATOR`, clears it, then ripples a grid of tiles out from
  screen centre via `stagger(…, { grid, from: "center" })`, with an amber
  shockwave on the leading edge.
- `gate/AccessGate` — arriving on a sub-page. Fast handshake log, then one of
  three clearance lines (`ACCESS GRANTED` / `FILES DECRYPTED` /
  `ACCEPTABLE CLEARANCE`, picked at random), then the same ripple.
- `gate/ReplayCover` — home back to boot, the uncover run backwards: the same
  stagger with `reversed: true`, so tiles close in from the edges to the centre,
  then a solid layer seals and hands over to the flickering standby panel.
- `chrome/FlapDisplay` — the section board in the nav. Two static halves and a
  leaf hinged along the seam between them: it drops to the hinge under `in(2)`
  and slaps flat under `out(3)`, carrying the old top on its front and the new
  bottom on its back. Timings are `flapFall` / `flapLand` in `src/lib/hud.ts`.

All cue points live in `src/lib/gate.ts` — that's the file to edit to retime any
of it. Every gate unmounts on its timeline's `onComplete`, never on a timer; the
handoff notes an earlier timer-driven version got cut off mid-wipe. The 9s
fallback exists only so a dropped event can't leave the page sealed.

**Motion** (`motion/react`) owns the running boot terminal and the site chrome:
log lines arriving, the progress bar, the scan band, the standby/running
cross-fade. `MotionConfig reducedMotion="user"` covers all of it in one switch;
the anime.js pieces call `prefersReducedMotion()` themselves and degrade to
plain fades. Timings are in `src/lib/motion.ts`.

> If the insignia or the ripple look frozen, check your OS motion setting —
> Windows *Settings, Accessibility, Visual effects, Animation effects*. With it
> off, every animation here deliberately collapses to a fade.

## Gating and navigation

`src/lib/session.ts` holds a module-level "already gated" flag. It survives
client-side navigation but resets on reload, which draws the line exactly where
it should: reloading `/` plays the full cold boot, while coming back from
`/about` drops you straight onto the site. Nav links are absolute (`/#about`) so
they resolve from any route.

The five section links are one split-flap card rather than a row — five labels
do not fit across a nav bar the visitor is allowed to scale up. The board
follows the page on its own (`useActiveSection`: the last section past 30% of
the viewport wins, and the bottom of the document always wins outright, since
the closing section is too short to ever climb that far) and the pair of arrows
beside it are ordinary links to the sections either side, so scrolling is the
only thing that ever turns it. On a
sub-page, where none of those sections are mounted, the board names the page.

## Interaction

- `Enter` / `Space` (or the button) starts the boot sequence; `Escape` or
  `SKIP →` jumps to the reveal.
- `REPLAY BOOT` in the status bar resets to standby, clears every timer, scrolls
  to top and re-locks the page.
- Body scroll is locked from load until the ripple finishes.

## Deviations from the prototype

Everything spec'd in the handoff is matched at desktop widths. Changes:

1. **One hero.** The handoff shipped three behind an A/B/C toggle and said to
   pick one. Layout B ships; the toggle is gone, and its orbital ring was
   dropped. The others are in `design/archive/home-layouts/`.
2. **New transitions.** The bottom-to-top curtain wipe was replaced by the
   greeting + grid ripple, plus the access and replay gates described above.
3. **Sub-pages.** About and Writing are previews on the home page with
   `READ MORE`, and have routes of their own.
4. **Responsive.** The prototype was desktop-only. Below 900px the section,
   hero and project grids collapse to one column and display type scales via
   `clamp()`. At ≥1236px every value is the spec'd one.
5. **Focus-visible** styling added (amber outline) — the prototype had none.
6. **`DOWNLOAD CV (PDF) ↓`** points at `/VietResume.pdf`; the prototype had no
   target.
7. The page wrapper's bottom pad keeps the footer clear of the fixed status
   bar, and follows it up and down as the chrome is rescaled.
8. **Chrome scale.** The nav and the status bar are drawn at the prototype's
   size and then magnified as a unit — 1x, 1.5x (the default) or 2x — from the
   gear in the nav. The number lives on the document as `--chrome-scale`; the
   bars read it through `zoom`, and everything that has to clear them measures
   from `--nav-h` / `--status-h`. It is remembered in `localStorage` and
   restored by a blocking one-liner in the layout, ahead of the first paint.

## Content still to resolve

Carried over from the handoff's own list:

1. Every project link points at `https://github.com/eon1999` (the profile).
   Each card needs its real repo URL, and Beehive + UT-Compass need real
   deployment URLs — drop `liveHref` for anything undeployed.
   (`src/data/projects.ts`)
2. `WRITING` is empty. Add entries newest-first in `src/data/writing.ts`; the
   home feed takes the top three and `/writing` lists everything. Both show an
   empty state until then.
3. `/about` reuses the two home paragraphs and the current postings. It wants
   copy of its own.
4. LinkedIn points at `https://linkedin.com`. (`src/data/profile.ts`)
5. Confirm "Open to summer 2027 internships" is still the right ask.
