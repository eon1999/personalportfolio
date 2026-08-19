import Link from "next/link";
import { NAV_ITEMS, PROFILE } from "@/data/profile";
import { Triangle } from "@/components/ui/Triangle";
import { DisplayText } from "@/components/ui/DisplayText";
import { SessionTimer } from "./SessionTimer";

export function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[4] flex h-11 items-center gap-[18px] border-b border-line bg-chrome-top px-[18px] backdrop-blur-[6px]">
      <Link href="/" className="flex items-center gap-[9px] text-ink hover:text-ink">
        <Triangle className="size-[13px] shrink-0" />
        <span className="hidden text-[13px] tracking-[.26em] sm:inline">
          <DisplayText>{PROFILE.shortName}</DisplayText>
        </span>
      </Link>

      <div className="ml-auto">
        <SessionTimer />
      </div>

      <nav aria-label="Sections" className="flex gap-[2px]">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="px-[6px] py-[6px] text-[9px] tracking-[.14em] text-dim transition-colors hover:bg-ac-tint hover:text-ink wide:px-[11px] wide:text-[10.5px] wide:tracking-[.18em]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
