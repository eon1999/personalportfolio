"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { GearIcon } from "@/components/ui/GearIcon";
import { SettingsPanel } from "./SettingsPanel";

/**
 * The nav-bar handle for the settings card. Built to the same spec as
 * `MusicButton` — hairline box, mark, label that drops below `wide` — because
 * the two sit side by side and any difference between them would read as an
 * accident.
 */
export function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Open settings"
        className={cn(
          "group flex items-center gap-[7px] border border-line px-[10px] py-[4px]",
          "transition-colors duration-[var(--t-hover)] ease-out",
          "hover:border-ac hover:bg-ac-tint",
        )}
      >
        {/* One tooth of travel on hover: enough to say the thing turns.
            `text-ac-solid`, not `text-ac` — the stroke is `currentColor`,
            which the gradient utility's transparent `color` would blank. */}
        <GearIcon
          className={cn(
            "size-[12px] shrink-0 text-dim",
            "transition-[transform,color] duration-[var(--t-hover)] ease-out",
            "group-hover:rotate-45 group-hover:text-ac-solid",
            "motion-reduce:transition-none",
          )}
        />
        <span className="hidden text-[8.5px] tracking-[.24em] text-dim @min-[380px]:inline">
          CONFIG
        </span>
        <span className="sr-only">Open settings</span>
      </button>

      {open ? <SettingsPanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}
