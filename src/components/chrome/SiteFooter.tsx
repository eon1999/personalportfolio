import { PROFILE } from "@/data/profile";
import { SegmentReadout } from "@/components/ui/SegmentReadout";

export function SiteFooter({ clock }: { readonly clock: string }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-[18px] py-[14px] text-[9.5px] tracking-[.22em] text-dim">
      <span>{PROFILE.copyright}</span>

      <span className="flex items-center gap-[7px]">
        <span aria-hidden>REC</span>
        <SegmentReadout
          value={clock || "00:00:00"}
          height={12}
          quiet
          tone="text-dim"
          label={`Recording since ${clock}`}
        />
      </span>
    </footer>
  );
}
