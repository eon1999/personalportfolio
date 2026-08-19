export const PROFILE = {
  firstName: "VIET-ANH",
  lastName: "DANG",
  shortName: "V. DANG",
  terminal: "TERMINAL 001",
  location: "AUSTIN, TX",
  class: "B.S. CS / 2028",
  graduation: "MAY 2028",
  status: "AVAILABLE",
  email: "dangviet@utexas.edu",
  phone: "713-834-4047",
  ask: ["Open to summer 2027", "internships."],
  resumeHref: "/VietResume.pdf",
  copyright: "© 2026 V. DANG — TERMINAL 001",
} as const;

export const LINKS = {
  github: "https://github.com/eon1999",
  linkedin: "https://linkedin.com",
} as const;

/** Hero body copy. */
export const HERO_BIO =
  "CS student at UT Austin. Machine learning research at the Oden Institute, full-stack platforms, and research tooling.";

export const ABOUT_PARAGRAPHS: readonly string[] = [
  "I study computer science at UT Austin, with minors in Statistics & Data Science and Business. At the Oden Institute I work with Dr. Sergey Fomel on machine learning for geophysical data, and I'm one of ten Engineering Fellows at the Texas Product Engineering Organization, building software for Austin nonprofits and startups.",
  "My projects tend to sit between research and infrastructure: a diffusion model for subsurface imaging, a club management platform in production use, a 300-mod Minecraft pack with its own balance tooling. Outside of that: jazz and blues guitar, hiking, and cooking.",
];

/** How many About paragraphs the home page shows before `READ MORE`. */
export const ABOUT_PREVIEW_COUNT = 1;

export const SKILLS: readonly string[] = [
  "PYTHON",
  "TYPESCRIPT",
  "NEXT.JS",
  "PYTORCH",
  "FASTAPI",
  "POSTGRESQL",
  "PRISMA",
  "DOCKER",
];

/**
 * Section links are absolute so they still resolve from a sub-page. On the home
 * page they behave as ordinary same-document fragment links.
 */
export const NAV_ITEMS = [
  { id: "about", label: "01 ABOUT", href: "/#about" },
  { id: "projects", label: "02 PROJECTS", href: "/#projects" },
  { id: "writing", label: "03 WRITING", href: "/#writing" },
  { id: "resume", label: "04 RECORD", href: "/#resume" },
  { id: "contact", label: "05 CONTACT", href: "/#contact" },
] as const;
