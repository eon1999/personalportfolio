import { LINKS } from "./profile";

export type ProjectStatus = "IN PROGRESS" | "MVP SHIPPED" | "DEPLOYED";

export interface Project {
  readonly id: string;
  /** e.g. "UNIT 01 — RESEARCH" */
  readonly unit: string;
  readonly status: ProjectStatus;
  readonly title: string;
  /** One line, on the carousel panel itself. */
  readonly blurb: string;
  /** The long version, only ever read inside the dossier pop-out. */
  readonly writeup: string;
  readonly stack: readonly string[];
  /** Start date, e.g. "JUN 2026 →". */
  readonly since: string;
  readonly sourceHref: string;
  readonly liveHref?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "geofwi",
    unit: "UNIT 01 — RESEARCH",
    status: "IN PROGRESS",
    title: "GEOFWI",
    blurb:
      "A diffusion model that reconstructs a full 2D subsurface velocity section from a single 1D profile.",
    writeup:
      "A diffusion model that reconstructs full 2D subsurface velocity sections from a single 1D profile through an encoder-decoder architecture. Replaced a geometrically-stamped synthetic dataset with a genuine forward stratigraphic simulation pipeline, and fixed data leakage with a group-aware 70/15/15 split.",
    stack: ["PYTHON", "PYTORCH", "CNNs"],
    since: "JUN 2026 →",
    sourceHref: LINKS.github,
  },
  {
    id: "beehive",
    unit: "UNIT 02 — PLATFORM",
    status: "MVP SHIPPED",
    title: "BEEHIVE",
    blurb:
      "Full-stack club management for volunteer organizations — hours, carpools, events, attendance.",
    writeup:
      "Full-stack club management for volunteer organizations: hours tracking, carpool coordination, events, and attendance check-in. Event-centric data model with role-based permissions and multi-org membership. 23 passing tests, CI/CD through GitHub Actions and Vercel, packaged as an offline-capable PWA.",
    stack: ["NEXT.JS", "TYPESCRIPT", "POSTGRES", "PRISMA"],
    since: "JUL 2026 →",
    sourceHref: LINKS.github,
    liveHref: LINKS.github,
  },
  {
    id: "ut-compass",
    unit: "UNIT 03 — PLATFORM",
    status: "DEPLOYED",
    title: "UT-COMPASS",
    blurb:
      "Campus event recommendations for UT Austin, ranked in real time against a student profile.",
    writeup:
      "Campus event recommendation platform for UT Austin. An automated pipeline scrapes 300+ HornsLink events daily, enriches them with zero-shot NLP classification and an LLM tagging layer, then ranks them in real time against profiles built from major, interests, and hobbies.",
    stack: ["NEXT.JS", "FIREBASE", "FASTAPI", "DEBERTA"],
    since: "JAN 2026 →",
    sourceHref: LINKS.github,
    liveHref: LINKS.github,
  },
  {
    id: "phthisis",
    unit: "UNIT 04 — INFRASTRUCTURE",
    status: "IN PROGRESS",
    title: "PROJECT PHTHISIS",
    blurb:
      "300+ independently-authored Minecraft mods integrated into one balanced, reproducible system.",
    writeup:
      "300+ independently-authored Minecraft mods integrated into one balanced system via overlay scripting rather than upstream patches, keeping upgrades reproducible. Includes a 475-entry balance spreadsheet with a drift-verification tool, and a dedicated Oracle Cloud server hosting the pack for players.",
    stack: ["KUBEJS", "PYTHON", "FORGE", "UBUNTU"],
    since: "AUG 2026 →",
    sourceHref: LINKS.github,
  },
  {
    id: "satella",
    unit: "UNIT 05 — PIPELINE",
    status: "IN PROGRESS",
    title: "SATELLA",
    blurb:
      "An evidence pipeline that assembles sourced, human-checkable dossiers instead of verdicts.",
    writeup:
      "An evidence-gathering pipeline that assembles sourced, human-checkable dossiers on public accounts rather than issuing automated verdicts. Five-source scraper architecture that fails soft and merges into unified per-subject records, with deterministic detection logic, source citations on every finding, and confidence floors against low-sample false positives.",
    stack: ["PYTHON", "FASTAPI", "WEB SCRAPING"],
    since: "MAY 2026 →",
    sourceHref: LINKS.github,
  },
];
