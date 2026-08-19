export interface RecordEntry {
  readonly id: string;
  readonly period: string;
  readonly role: string;
  readonly org: string;
  readonly detail: string;
}

export const RECORD: readonly RecordEntry[] = [
  {
    id: "oden",
    period: "FEB 2026 — PRESENT",
    role: "Undergraduate Research Assistant",
    org: "Oden Institute for Computational Engineering & Sciences",
    detail:
      "Working with Dr. Sergey Fomel on transformers for geophysical data analysis. Developing GeoFWI alongside a post-doc, integrating with Dr. Fomel's legacy code and training on novel data. Applying the same techniques to problems in astronomy (PLAsTiCC) and environmental science (DS4G).",
  },
  {
    id: "tpeo",
    period: "SEP 2025 — PRESENT",
    role: "Engineering Fellow",
    org: "Texas Product Engineering Organization",
    detail:
      "One of 10 fellows selected from over 250 applicants. Working on cross-functional teams building real-world solutions for Austin nonprofits and startups.",
  },
  {
    id: "ut",
    period: "2024 — MAY 2028",
    role: "B.S. Computer Science",
    org: "The University of Texas at Austin · Minors in Statistics & Data Science, Business",
    detail:
      "Data Structures, Computer Architecture, Operating Systems, Intro to Data Science, Game Design Paradigms.",
  },
];
