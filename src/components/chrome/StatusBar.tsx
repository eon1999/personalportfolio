import { SegmentReadout } from "@/components/ui/SegmentReadout";

interface StatusBarProps {
  /** Zero-padded percentage, e.g. `07%`. */
  readonly scrollProgress: string;
  /**
   * Sync ratio the boot sequence settled on (0–64.7). Omitted until the
   * sequence has finished, and on pages that never ran one.
   */
  readonly syncValue?: number;
  /** Right-hand slot — `REPLAY BOOT` on the home page, a way back elsewhere. */
  readonly children?: React.ReactNode;
}

export function StatusBar({
  scrollProgress,
  syncValue,
  children,
}: StatusBarProps) {
  // Always three cells, so the readout never changes width at 100%.
  const digits = scrollProgress.replace("%", "").padStart(3, "0");

  return (
    <div className="chrome-bar fixed inset-x-0 bottom-0 z-[4] flex h-[30px] items-center gap-[14px] border-t border-line bg-chrome-bottom px-[14px] text-[9.5px] tracking-[.2em] text-dim">
      <span className="text-ac2">● LINK NOMINAL</span>

      <span className="flex items-center gap-[6px]">
        <span aria-hidden>SCROLL</span>
        <SegmentReadout
          value={digits}
          height={12}
          quiet
          className="lcd"
          label={`Scrolled ${scrollProgress}`}
        />
        <span aria-hidden>%</span>
      </span>

      {syncValue !== undefined ? (
        <span className="hidden items-center gap-[6px] wide:flex">
          <span aria-hidden>SYNC</span>
          <span className="tabular-nums text-ac">{syncValue.toFixed(1)}%</span>
        </span>
      ) : null}

      {children ? <div className="ml-auto">{children}</div> : null}
    </div>
  );
}
