import { cn } from "@/lib/cn";

interface SectionShellProps {
  readonly id: string;
  /** Left-column marker, e.g. `02 / PROJECTS`. */
  readonly marker: string;
  /** The final section carries the page's bottom padding instead of a rule. */
  readonly last?: boolean;
  readonly children: React.ReactNode;
}

/** Every content section shares this two-column skeleton. */
export function SectionShell({
  id,
  marker,
  last,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "grid scroll-mt-[60px] grid-cols-1 gap-6 pt-14 wide:grid-cols-[180px_1fr] wide:gap-[34px]",
        last ? "pb-[90px]" : "border-b border-line pb-14",
      )}
    >
      <h2 data-scatter-item className="text-[10px] tracking-[.28em] text-ac">
        {marker}
      </h2>
      {/* Each block inside comes apart on its own — see `useScatter`. */}
      <div data-scatter>{children}</div>
    </section>
  );
}
