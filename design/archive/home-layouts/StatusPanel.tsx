"use client";

import { PROFILE } from "@/data/profile";
import { SYNC_BAR_TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Bar } from "@/components/ui/Bar";
import { TelemetryStrip } from "./TelemetryStrip";

interface StatusPanelProps {
  readonly clock: string;
  readonly sync: number;
}

export function StatusPanel({ clock, sync }: StatusPanelProps) {
  return (
    <aside className="border border-line bg-panel p-4 pb-[18px]">
      <p className="border-b border-line pb-[10px] text-[9.5px] tracking-[.26em] text-dim">
        STATUS PANEL
      </p>

      <dl className="mt-[14px] grid gap-[11px] text-[10.5px]">
        <PanelRow label="LOCATION" value={PROFILE.location} />
        <PanelRow label="CLASS" value={PROFILE.class} />
        <PanelRow
          label="STATUS"
          value={`● ${PROFILE.status}`}
          valueClassName="text-ac2"
        />
        <PanelRow
          label="LOCAL TIME"
          value={clock}
          valueClassName="tabular-nums"
        />
      </dl>

      <p className="mt-[18px] text-[9.5px] tracking-[.22em] text-dim">
        SYNC RATIO
      </p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-[36px] font-medium leading-none tabular-nums text-ac">
          {sync.toFixed(1)}
        </span>
        <span className="text-[11px] text-dim">%</span>
      </p>
      <Bar
        value={sync / 100}
        transition={SYNC_BAR_TRANSITION}
        className="mt-2 h-[4px] bg-track-soft"
        label="Sync ratio"
      />

      <TelemetryStrip />
    </aside>
  );
}

function PanelRow({
  label,
  value,
  valueClassName,
}: {
  readonly label: string;
  readonly value: string;
  readonly valueClassName?: string;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-dim">{label}</dt>
      <dd className={cn("m-0", valueClassName)}>{value}</dd>
    </div>
  );
}
