import Link from "next/link";
import { PROFILE } from "@/data/profile";
import { Triangle } from "@/components/ui/Triangle";
import { DisplayText } from "@/components/ui/DisplayText";
import { MusicButton } from "@/components/audio/MusicButton";
import { SettingsButton } from "@/components/settings/SettingsButton";
import { SectionFlap } from "./SectionFlap";
import { SessionTimer } from "./SessionTimer";

export function TopNav() {
  return (
    // `chrome-bar` magnifies everything below at the visitor's chosen
    // scale, so the sizes here stay the 1x drawing.
    <header className="chrome-bar @container fixed inset-x-0 top-0 z-[4] flex h-11 items-center gap-[18px] border-b border-line bg-chrome-top px-[18px] backdrop-blur-[6px]">
      <Link href="/" className="flex items-center gap-[9px] text-ink hover:text-ink">
        <Triangle className="size-[13px] shrink-0" />
        <span className="hidden text-[13px] tracking-[.26em] @min-[440px]:inline">
          <DisplayText>{PROFILE.shortName}</DisplayText>
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-[9px]">
        <MusicButton />
        <SettingsButton />
        <SessionTimer />
      </div>

      <SectionFlap />
    </header>
  );
}
