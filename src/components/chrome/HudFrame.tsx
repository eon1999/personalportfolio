import { cn } from "@/lib/cn";

/** Bracket + the edge ticks that run away from it along both axes. */
function Corner({ className }: { readonly className: string }) {
  return <span className={cn("absolute size-[18px] border-ac/45", className)} />;
}

/**
 * Cockpit framing for the viewport — the brackets from the boot screen, kept
 * on permanently and dialled down, so the site reads as something being
 * displayed inside a canopy rather than a page.
 */
export function HudFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-[10px] top-[calc(var(--nav-h)+10px)] bottom-[calc(var(--status-h)+10px)] z-[5]"
    >
      <Corner className="left-0 top-0 border-l border-t" />
      <Corner className="right-0 top-0 border-r border-t" />
      <Corner className="bottom-0 left-0 border-b border-l" />
      <Corner className="bottom-0 right-0 border-b border-r" />
    </div>
  );
}
