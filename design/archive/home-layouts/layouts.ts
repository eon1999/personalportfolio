export const HERO_LAYOUTS = ["A", "B", "C"] as const;

export type HeroLayout = (typeof HERO_LAYOUTS)[number];
