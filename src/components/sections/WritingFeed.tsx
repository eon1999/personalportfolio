import type { WritingEntry } from "@/data/writing";
import { cn } from "@/lib/cn";

interface WritingFeedProps {
  readonly entries: readonly WritingEntry[];
}

/** The row list shared by the home feed and the full `/writing` index. */
export function WritingFeed({ entries }: WritingFeedProps) {
  if (entries.length === 0) {
    return (
      <div className="border-y border-line px-2 py-8">
        <p className="text-[13px] leading-[1.8] text-body-card">
          No entries logged yet.
        </p>
        <p className="mt-2 text-[10px] tracking-[.22em] text-dim">
          SECTOR EMPTY — AWAITING FIRST WRITE
        </p>
      </div>
    );
  }

  return (
    <div className="grid">
      {entries.map((entry, index) => (
        <a
          key={entry.id}
          href={entry.href}
          className={cn(
            "grid grid-cols-[70px_1fr_auto] items-baseline gap-[18px] border-t border-line py-4 pl-2 pr-2 text-ink",
            "transition-[padding-left,background-color] duration-[var(--t-hover)] ease-out hover:bg-ac-wash hover:pl-[14px]",
            "wide:grid-cols-[96px_1fr_auto]",
            index === entries.length - 1 && "border-b",
          )}
        >
          <span className="text-[10.5px] tabular-nums text-dim">
            {entry.date}
          </span>
          <span className="text-[13px] wide:text-[14.5px]">{entry.title}</span>
          <span className="text-[10px] text-dim">{entry.readTime}</span>
        </a>
      ))}
    </div>
  );
}
