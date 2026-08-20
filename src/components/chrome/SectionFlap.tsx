"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/profile";
import { cn } from "@/lib/cn";
import { useActiveSection } from "@/hooks/useActiveSection";
import { FlapDisplay } from "./FlapDisplay";

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
const LABELS = NAV_ITEMS.map((item) => item.label);

type NavItem = (typeof NAV_ITEMS)[number];

/** Half the board's height each, so the pair stands exactly as tall as it. */
const ARROW = "flex h-[10px] w-[15px] items-center justify-center";

/** One step up or down the board, or a dead stop at either end of it. */
function FlapArrow({
  item,
  down,
}: {
  readonly item: NavItem | null;
  readonly down?: boolean;
}) {
  const mark = (
    <span
      aria-hidden
      className={cn(
        "tri block size-[6px] transition-colors duration-[var(--t-hover)] ease-out",
        down && "rotate-180",
        item ? "bg-dim group-hover/arrow:bg-ac" : "bg-dim/30",
      )}
    />
  );

  if (!item) {
    // The end of the list. Kept in place rather than removed, so the pair does
    // not lose half its height at the top and bottom of the page.
    return (
      <span aria-hidden className={cn(ARROW, "cursor-default")}>
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-label={`Go to ${item.label}`}
      className={cn(ARROW, "group/arrow")}
    >
      {mark}
    </Link>
  );
}

/**
 * The section list, collapsed to one card.
 *
 * Five links do not fit across a nav bar the visitor is allowed to double the
 * size of, so they turn through a split-flap instead. It follows the page on
 * its own — the card names whatever section is being read — and the pair of
 * arrows beside it are ordinary links to the sections either side, which means
 * the board is never told to show one thing while the page shows another.
 * Scrolling is the only thing that ever moves it.
 */
export function SectionFlap() {
  const pathname = usePathname();

  // A sub-page has none of the home page's sections mounted to watch, so the
  // board names the page itself: `/about` is the ABOUT card.
  const page = NAV_ITEMS.findIndex((item) => `/${item.id}` === pathname);
  const observed = useActiveSection(SECTION_IDS);
  const index = observed ?? Math.max(0, page);

  const current = NAV_ITEMS[index];

  return (
    <nav aria-label="Sections" className="flex items-center gap-[4px]">
      <Link
        href={current.href}
        className="block transition-opacity duration-[var(--t-hover)] ease-out hover:opacity-80"
      >
        <FlapDisplay labels={LABELS} index={index} />
        <span className="sr-only">Current section: {current.label}</span>
      </Link>

      {/* Stacked rather than side by side: up and down is what they mean. */}
      <span className="flex flex-col gap-[2px]">
        <FlapArrow item={index > 0 ? NAV_ITEMS[index - 1] : null} />
        <FlapArrow
          item={index < NAV_ITEMS.length - 1 ? NAV_ITEMS[index + 1] : null}
          down
        />
      </span>
    </nav>
  );
}
