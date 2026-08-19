import { PROFILE } from "@/data/profile";
import { RECORD } from "@/data/record";
import { cn } from "@/lib/cn";
import { DisplayText } from "@/components/ui/DisplayText";
import { SectionShell } from "./SectionShell";

export function RecordSection() {
  const lastIndex = RECORD.length - 1;

  return (
    <SectionShell id="resume" marker="04 / RECORD">
      {RECORD.map((entry, index) => (
        <div
          key={entry.id}
          className={cn(
            "grid grid-cols-1 gap-[18px] wide:grid-cols-[130px_1fr]",
            index === 0 ? "pb-5" : "py-5",
            index !== lastIndex && "border-b border-line",
          )}
        >
          <p className="text-[10.5px] tracking-[.1em] text-dim">
            {entry.period}
          </p>
          <div>
            <h3 className="text-[20px]">
              <DisplayText>{entry.role}</DisplayText>
            </h3>
            <p className="mt-[3px] text-[12px] text-dim">{entry.org}</p>
            <p className="mt-[10px] max-w-[58ch] text-[13px] leading-[1.8] text-body-card">
              {entry.detail}
            </p>
          </div>
        </div>
      ))}

      <a
        href={PROFILE.resumeHref}
        target="_blank"
        rel="noreferrer"
        className="btn-ac mt-[18px] inline-block px-[22px] py-3 text-[11px] tracking-[.2em]"
      >
        DOWNLOAD CV (PDF) ↓
      </a>
    </SectionShell>
  );
}
