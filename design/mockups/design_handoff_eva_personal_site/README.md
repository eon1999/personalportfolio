# Handoff: Personal Site — mecha-terminal theme (Viet-Anh Dang)

## Overview
A single-page personal site for a CS student targeting recruiters. Two parts:

1. **Boot sequence** — a full-screen "standby" screen the visitor must trigger (`PRESS [ENTER] TO INITIATE`, or click). It streams a ~4.2s log readout with a progress bar and a rising sync ratio, then fades to black and a black panel slides upward to reveal the site.
2. **The site** — a dark, console-styled one-pager: fixed top nav, five numbered sections (About, Projects, Writing, Record, Contact), a fixed bottom status bar, and a footer.

Anime/mecha-cockpit flavor (amber-on-black, monospace telemetry, corner brackets, scanlines) is applied as original styling — no third-party logos, marks, or copied interface art.

## About the Design Files
`Personal Site.dc.html` is a **design reference created in HTML** — a working prototype of the intended look and behavior, not production code to lift wholesale. All styling is written as inline styles for streaming reasons specific to the prototyping environment; do **not** carry that convention into the real app.

The task is to **recreate this design in the target codebase's environment** using its established patterns. If there's no codebase yet, Next.js (App Router) + Tailwind is the natural fit here — it matches the stack already used in Beehive and UT-Compass and deploys to Vercel.

The file opens directly in a browser. Note it depends on a small runtime helper (`support.js`) that is *not* part of the design — ignore it and read the markup/logic as spec. `VietResume.pdf` is the source of all copy and is included for fact-checking.

## Fidelity
**High-fidelity.** Colors, type, spacing, timings, and interactions below are final and should be matched closely. Copy is final except where noted under Content gaps.

## Screens / Views

### 1. Boot screen — STANDBY (idle)
Purpose: gate the site behind one deliberate action, establishing the cockpit conceit.

- Full-viewport fixed overlay, `z-index: 20`, background `#040506`, contents centered (flex, center/center), `overflow: hidden`. Body scroll is locked while it's up.
- **Corner brackets**: four 26×26px L-shapes, 1px `--ac` borders, inset 22px from each corner.
- **Header strip**: `TERMINAL 001 — OPERATIONS INTERFACE` at top-left (left 64px, top 30px), live clock `HH:MM:SS` at top-right. Both 9.5px mono, `letter-spacing: .3em`, color `--dim`.
- **Insignia**: 150×150px stack — outer 1px circle `rgba(255,107,26,.35)` rotating 360° every 18s with a 6px amber dot at its top; inner circle inset 26px, 1px `rgba(255,107,26,.2)`; centered 28px amber triangle (`clip-path: polygon(50% 0, 100% 100%, 0 100%)`) flickering on a 3s cycle (opacity .85 → .55 → .95).
- **Title**: `STANDBY` — Oswald 300, 52px, `letter-spacing: .18em`, `--ink`, 34px below the insignia.
- **Subtitle**: `OPERATOR RECORD — V. DANG` — 11px mono, `.34em`, `--dim`.
- **Button**: `PRESS [ ENTER ] TO INITIATE` — 12px mono, `.28em`, 16px/34px padding, 1px `--ac` border, transparent fill, amber text; hover fills `--ac` with `#000` text. 44px top margin.
- **Hint**: `AWAITING OPERATOR INPUT` — 9.5px, `.24em`, `--dim`, blinking on a 1.2s step-end cycle.
- **Ambient**: a 120px-tall vertical gradient band (`transparent → rgba(255,107,26,.06) → transparent`) sweeping top→bottom every 5.5s; scanline overlay (repeating 4px horizontal gradient, 1px of `rgba(0,0,0,.4)`).

### 2. Boot screen — running
Same overlay; content swaps to a `min(760px, 86vw)` console block.

- **Phase label** (Oswald 34px, `.14em`, amber) driven by progress: `INITIATING` (≤40%), `SYNCHRONIZING` (41–80%), `RELEASING` (>80%). Right-aligned counter: `SEQUENCE 000%` (3-digit zero-padded), 11px, `.24em`, `--dim`.
- **Progress bar**: 3px track `rgba(255,255,255,.08)`, amber fill, `transition: width .3s linear`.
- **Log window**: 250px tall, `overflow: hidden`, 1px `--line` border, background `rgba(255,255,255,.015)`, 14px/16px padding. Lines are 12px mono, `line-height: 1.75`, each entering with a 180ms `translateY(6px) + fade` animation. Format: dim `[00.00]` timestamp + message. Only the last 11 lines are kept.
  - Message colors by kind: normal `#a5a29a`, ok `#8bffb0`, warn `#ffb545`.
  - Sequence (ms, kind, text) — exact copy:
    ```
    0     boot  power bus ....................... nominal
    260   boot  coolant loop A/B ................ nominal
    520   boot  loading operator record 001
    820   ok    record found: DANG, VIET-ANH
    1120  boot  entry plug ...................... locked
    1420  boot  LCL pressure .................... 1.04 atm
    1700  warn  harmonics drifting — recalibrating
    2050  ok    harmonics ....................... stable
    2350  boot  establishing neural link
    2700  ok    link established — sync ratio rising
    3100  boot  mounting /projects /writing /record
    3400  ok    all sectors mounted
    3750  ok    INTERFACE READY — RELEASING CONTROL
    ```
- **Footer row**: `PWR OK` · `LINK OK` · `SYNC 00.0%` (10px, `.2em`; OK in `--ac2`, sync value in `--ac`), and a `SKIP →` button on the right (10px, `.24em`, 1px `--line` border; hover border/text `--ink`). `Escape` also skips.

### 3. Boot → site transition (important — this is the signature moment)
Timed from sequence end (or SKIP):

| t (ms) | what happens |
| --- | --- |
| 0 | A full-viewport black panel (`#040506`, `z-index: 21`, `pointer-events: none`) mounts at `opacity: 0` |
| +40 | Panel goes to `opacity: 1` over `.55s ease` — the terminal fades to black |
| +620 | Boot overlay unmounts behind the black panel |
| +900 | Panel animates `transform: translateY(0) → translateY(-100%)` over `1.25s cubic-bezier(.76,0,.24,1)`, revealing the site bottom-to-top |
| on `animationend` | Panel unmounts, body scroll unlocks, sync-ratio drift starts (4s safety-timeout fallback) |

A 2px amber line with `box-shadow: 0 0 34px 10px rgba(255,107,26,.45)` sits at the panel's bottom edge and rides up with it as the reveal line.

Implementation note, learned the hard way: animate `transform` via a keyframe and unmount on `animationend`. Earlier attempts using a `clip-path` transition plus a fixed unmount timer failed — the full-viewport clip-path repaint took ~900ms to start and got cut off mid-wipe. Don't reintroduce a fixed timer as the primary unmount trigger.

### 4. Site — fixed chrome
- **Top nav** (`position: fixed`, 44px tall, `z-index: 4`): background `rgba(8,9,10,.86)`, `backdrop-filter: blur(6px)`, 1px bottom `--line`. Left: 13px amber triangle + `V. DANG` (Oswald 500, 13px, `.26em`). Right: anchor links `01 ABOUT`, `02 PROJECTS`, `03 WRITING`, `04 RECORD`, `05 CONTACT` — 10.5px, `.18em`, `--dim`, 6px/11px padding; hover `--ink` on `rgba(255,107,26,.1)`.
- **Bottom status bar** (fixed, 30px, `z-index: 4`): `rgba(8,9,10,.92)`, 1px top `--line`, 9.5px/`.2em` `--dim`. Left: `● LINK NOMINAL` (in `--ac2`) and `SCROLL 00%` (live scroll percentage, 2-digit zero-padded). Right: `HOME LAYOUT` + `A` `B` `C` toggles (active = amber fill, black text) + `REPLAY BOOT`.
- **Scanline overlay**: fixed, `z-index: 5`, `pointer-events: none`, `opacity: .5`, repeating 4px gradient with 1px of `rgba(0,0,0,.28)`. Should be behind a "reduce motion / reduce effects" preference in production.
- **Footer**: 1px top `--line`, 14px/18px padding, 9.5px/`.22em` `--dim`: `© 2026 V. DANG — TERMINAL 001` left, `REC HH:MM:SS` right.
- Content column: `max-width: 1180px`, centered, `padding: 44px 28px 0`. Sections use `scroll-margin-top: 60px` and `html { scroll-behavior: smooth }`.

### 5. Site — hero, three interchangeable layouts
The A/B/C toggle in the status bar swaps only the hero. **These are design options** — pick one for production (A is the default and the most recruiter-legible) and drop the toggle, unless you want it as an easter egg.

**Layout A — split with status panel** (`grid-template-columns: 1fr 300px`, 34px gap, `padding: 74px 0 60px`, 1px bottom `--line`)
- Eyebrow: 22px amber rule + `OPERATOR RECORD / 001` (10px, `.3em`, `--ac`).
- `VIET-ANH` (Oswald 300) / `DANG` (Oswald 600) on two lines — 82px, `line-height: .94`, `letter-spacing: -.01em`.
- Body paragraph: 13.5px, `line-height: 1.85`, `#b4b1a8`, `max-width: 52ch`, `text-wrap: pretty`.
- Buttons: `VIEW PROJECTS →` (1px amber border, amber text; hover amber fill + black text) and `CONTACT` (1px `--line`, `--dim`; hover `--ink`). 11px, `.2em`, 12px/22px padding.
- Right panel: 1px `--line`, background `--panel`, 16px padding. `STATUS PANEL` header (9.5px, `.26em`, `--dim`) over a rule; then label/value rows at 10.5px — `LOCATION AUSTIN, TX`, `CLASS B.S. CS / 2028`, `STATUS ● AVAILABLE` (`--ac2`), `LOCAL TIME HH:MM:SS`. Below: `SYNC RATIO`, a large Oswald 500 36px amber number with `%` suffix, a 4px bar matching the number, and a 12-cell 14px-tall telemetry strip (mixed amber/green/`rgba(255,255,255,.08)` opacities).
  - **Sync ratio is live**: random walk, updated every 160ms, `±~0.45` per step, clamped to `[58.2, 71.4]`, displayed to one decimal with tabular numerals; the bar width tracks it with `transition: width .16s linear`. Starts at 64.7 and begins drifting only after the reveal completes.

**Layout B — centered with orbital ring** (`padding: 96px 0 64px`, centered text)
420px circle outline `rgba(255,107,26,.18)` behind the text, rotating every 44s with a 7px amber dot at top. Eyebrow `TERMINAL 001 / OPERATOR FILE` (10px, `.44em`). Name: Oswald 200 + 600, 116px, `line-height: .9`. A 640px amber-to-transparent hairline under it. Then the short bio, then a metadata row: `AUSTIN, TX / B.S. CS 2028 / ● AVAILABLE / HH:MM:SS`.

**Layout C — dossier card** (`padding: 70px 0 58px`)
1px `--line` card on `--panel`. Title bar: `FILE / OPERATOR_DANG.V` left, `CLASSIFICATION: OPEN` right (amber). Body splits `1.5fr / 1fr` with a 1px divider: left is name (Oswald 400, 60px) + bio + `PROJECTS →` / `RECORD` buttons; right is four equal rows (each 1px-separated, 14px/18px padding) with 9px `.24em` labels over Oswald 22px values — `LOCATION AUSTIN, TX`, `GRADUATION MAY 2028`, `STATUS AVAILABLE` (`--ac2`), `LOCAL TIME HH:MM:SS`.

### 6. Site — content sections
All five share the same skeleton: `grid-template-columns: 180px 1fr`, 34px gap, `padding: 56px 0`, 1px bottom `--line` (Contact has none and pads `56px 0 90px`). The left column is just the section marker — 10px mono, `.28em`, `--ac`, e.g. `02 / PROJECTS`.

**01 / ABOUT** — two paragraphs (14px, `line-height: 1.9`, `#c8c5bc`, `max-width: 64ch`) then a wrapping row of 7px-gap skill chips: 10px, `.16em`, 6px/11px padding, 1px `--line`, `--dim` — PYTHON, TYPESCRIPT, NEXT.JS, PYTORCH, FASTAPI, POSTGRESQL, PRISMA, DOCKER.

**02 / PROJECTS** — `1fr 1fr` grid, 14px gap; the fifth card spans both columns. Card: 1px `--line`, `--panel` background, 20px padding; hover `border-color: --ac`, `background: #121415`.
- Header row: `UNIT 0N — CATEGORY` (9.5px, `.22em`, `--dim`) left, status right (`IN PROGRESS` amber, `MVP SHIPPED` / `DEPLOYED` green `--ac2`).
- Title: Oswald 400, 26px, `--ink`.
- Description: 12.5px, `line-height: 1.75`, `#a5a29a`.
- Meta line: 10px, `.14em`, `--dim` — stack + start date.
- **Link row** (the thing to wire up): separated by a 1px `--line` rule, 14px above/below, 8px gap. `SOURCE ↗` = 10px, `.18em`, 8px/14px padding, 1px `--line`, `--dim`; hover border+text amber. `LIVE SITE ↗` = same metrics but 1px amber border and amber text; hover amber fill, black text. All open in a new tab (`target="_blank" rel="noreferrer"`).
- Cards, in order: **GEOFWI** (research, source only) · **BEEHIVE** (source + live) · **UT-COMPASS** (source + live) · **PROJECT PHTHISIS** (source only) · **SATELLA** (full width; meta line and single button sit on one `space-between` row).

**03 / WRITING** — a stack of rows, each `grid-template-columns: 96px 1fr auto`, 18px gap, baseline-aligned, `padding: 16px 8px`, 1px top `--line` (last row also bottom): date `YYYY.MM.DD` (10.5px, `--dim`), title (14.5px), read time (10px, `--dim`). Hover: `background: rgba(255,107,26,.06)` and `padding-left: 14px` (a subtle nudge right). Ends with `ALL ENTRIES →` (10.5px, `.2em`, amber).

**04 / RECORD** — three entries, each `grid-template-columns: 130px 1fr`, 18px gap, 1px separators: date range (10.5px, `--dim`, `.1em`), then role (Oswald 20px), org (12px `--dim`), and a 13px/`1.8` description at `max-width: 58ch`. Entries: Oden Institute URA (Feb 2026 →), TPEO Engineering Fellow (Sep 2025 →), B.S. CS UT Austin (2024 – May 2028). Below: `DOWNLOAD CV (PDF) ↓` in the amber-outline button style.

**05 / CONTACT** — Oswald 300, 44px: "Open to summer 2027 / internships." Then `dangviet@utexas.edu` (17px mono, `mailto:`, 1px amber bottom border, 3px bottom padding), `713-834-4047` (13px `--dim`), then `GITHUB` / `LINKEDIN` links (10.5px, `.2em`, 22px gap).

## Interactions & Behavior
- **Boot gate**: `Enter` or `Space` (or the button) starts the sequence from idle; `Escape` or `SKIP →` jumps to the transition. Body scroll is locked from load until the reveal finishes.
- **REPLAY BOOT** in the status bar resets to idle, scrolls to top, clears all timers, and re-locks scroll.
- **Nav** is same-page anchor scrolling with smooth behavior and 60px scroll margin.
- **Live values**: clock ticks every 1s; scroll percentage updates on a passive scroll listener; sync ratio drifts every 160ms once revealed.
- **Hover states**: every link/button has one (see per-component specs). No focus-visible styling exists in the prototype — **add it**; the amber border style is the obvious basis.
- **Responsive**: the prototype is desktop-only. Below ~900px the `180px 1fr` section grid, `1fr 300px` hero, and two-column project grid all need to collapse to single column, and the 82–116px display type needs to scale down (`clamp()`).
- **Accessibility to fix in production**: honor `prefers-reduced-motion` (skip the sweep, ring rotation, flicker, and ideally offer a skip-straight-through boot); keep the scanline overlay optional; the boot gate must be keyboard-reachable and announced (it is keyboard-triggerable today, but there's no live region for the log).

## State Management
- `phase`: `idle | running | done` — drives which boot content shows and whether scroll is locked.
- `logs: {t, m, c}[]` — appended on timers, trimmed to the last 11.
- `pct: number` — 0–100 progress, derived from each log's timestamp over total duration; feeds the bar and phase label.
- `sync: number` — 0 → 64.7 during boot, stepped every 90ms.
- `hidden: boolean` — boot overlay unmounted.
- `curtain: null | 'in' | 'black' | 'up'` — reveal-panel state machine (see transition table).
- `live: number` — post-reveal sync-ratio random walk.
- `clock: string`, `scrollPct: string` — display-only tickers.
- `layout: 'A' | 'B' | 'C'` — hero variant; drop if you ship one hero.

Timers to clean up on unmount/replay: the log timeout array, the sync interval, the four transition timeouts, the animation-end fallback, the drift interval, and the clock interval. No data fetching anywhere.

## Design Tokens
Colors:
```
--bg     #08090a   page background
--panel  #0e1011   card/panel fill
#121415            card hover fill
#040506            boot overlay + reveal panel
--ink    #e9e6dd   primary text
#c8c5bc            body text (About)
#b4b1a8            hero body text
#a5a29a            card body / log text
--dim    #6d716f   labels, metadata
--line   rgba(233,230,221,.13)  all hairlines/borders
--ac     #ff6b1a   amber accent (links, actions, markers)
--ac2    #8bffb0   green — nominal/available status
         #ffb545   warn (boot log only)
```
Accent tints: `rgba(255,107,26,.06)` row hover · `.1` nav hover · `.18`/`.2`/`.35` ring strokes · `.45` edge glow.
`::selection` = amber background, black text. Alternate accents the prototype exposes as options: `#8bffb0`, `#c8b4ff`, `#ff3b30`.

Typography — **Oswald** (300/400/500/600 display) + **JetBrains Mono** (300/400/500/700, all body and UI), both Google Fonts.
```
116 / 82 / 60 / 52 / 44 / 36 / 34 / 26 / 22 / 20px   Oswald display sizes
17 / 14.5 / 14 / 13.5 / 13 / 12.5 / 12px             mono body sizes
11 / 10.5 / 10 / 9.5 / 9px                           mono labels (always letter-spaced)
letter-spacing: .44 / .34 / .3 / .28 / .26 / .24 / .22 / .2 / .18 / .16 / .14em
line-height: .9 / .94 / 1 / 1.1 / 1.75 / 1.85 / 1.9
```
Rule of thumb: display type is Oswald with tight leading; anything under 12px is mono, uppercase, and letter-spaced.

Spacing (px, from the prototype): `3 6 7 8 10 12 14 16 18 20 22 26 28 30 34 38 44 56 60 70 74 90 96`. Radii: **none** — every corner is square, deliberately. Shadows: only the amber reveal glow and the `box-shadow: 0 0 30px 8px rgba(255,107,26,.45)` edge; no elevation shadows anywhere.

Motion:
```
opacity fade            .55s ease
reveal wipe             1.25s cubic-bezier(.76,0,.24,1)
progress bar            .3s linear
sync bar                .16s linear
log line entry          .18s ease-out
ring rotation           18s (boot) / 44s (hero B) linear infinite
scan sweep              5.5s linear infinite
triangle flicker        3s infinite
cursor blink            1.2s step-end infinite
```

## Assets
None. Every graphic element is CSS — the triangle insignia is a `clip-path` polygon, the rings are bordered circles, the scanlines and sweep are repeating/linear gradients, the telemetry strip is a 12-cell grid of colored divs. Fonts come from Google Fonts. No images, icon set, or logos are used, and no third-party brand assets should be introduced.

## Content gaps to resolve before shipping
1. **All project links currently point at `https://github.com/eon1999`** (the profile). Each card needs its real repo URL, and Beehive + UT-Compass need real deployment URLs. The `LIVE SITE ↗` button should be omitted for projects without a deployment.
2. **The Writing section is placeholder** — the four post titles, dates, and read times are invented and must be replaced with real posts or the section removed.
3. **LinkedIn** links to `https://linkedin.com`; needs the real profile URL.
4. **`DOWNLOAD CV (PDF) ↓`** has no target; point it at the hosted resume.
5. Verify "Open to summer 2027 internships" is still the right ask.

## Files
- `Personal Site.dc.html` — the complete design (boot sequence + site, all three hero layouts). Markup is at the top, behavior in the `class Component` block near the bottom.
- `VietResume.pdf` — source for all biographical copy, project descriptions, and dates.
