import { HERO_BIO, PROFILE } from "@/data/profile";
import { cn } from "@/lib/cn";

/** Dossier hero: one card, bio on the left, vitals stacked on the right. */
export function HeroC({ clock }: { readonly clock: string }) {
  const vitals = [
    { label: "LOCATION", value: PROFILE.location },
    { label: "GRADUATION", value: PROFILE.graduation },
    { label: "STATUS", value: PROFILE.status, accent: true },
    { label: "LOCAL TIME", value: clock, numeric: true },
  ];

  return (
    <section className="border-b border-line pb-[58px] pt-[70px]">
      <div className="border border-line bg-panel">
        <div className="flex flex-wrap justify-between gap-2 border-b border-line px-[14px] py-[9px] text-[9.5px] tracking-[.24em] text-dim">
          <span>FILE / OPERATOR_DANG.V</span>
          <span className="text-ac">CLASSIFICATION: OPEN</span>
        </div>

        <div className="grid grid-cols-1 wide:grid-cols-[1.5fr_1fr]">
          <div className="border-b border-line px-[30px] py-[34px] wide:border-b-0 wide:border-r">
            <h1 className="font-display text-[clamp(34px,6.2vw,60px)] font-normal leading-none tracking-[.01em]">
              {PROFILE.firstName} {PROFILE.lastName}
            </h1>

            <p className="mt-5 max-w-[48ch] text-pretty text-[13px] leading-[1.85] text-body-hero">
              {HERO_BIO.c}
            </p>

            <div className="mt-[26px] flex flex-wrap gap-[10px]">
              <a
                href="#projects"
                className="btn-ac px-5 py-[11px] text-[11px] tracking-[.2em]"
              >
                PROJECTS →
              </a>
              <a
                href="#resume"
                className="btn-ghost px-5 py-[11px] text-[11px] tracking-[.2em]"
              >
                RECORD
              </a>
            </div>
          </div>

          <dl className="m-0 grid wide:grid-rows-4">
            {vitals.map((vital, index) => (
              <div
                key={vital.label}
                className={cn(
                  "px-[18px] py-[14px]",
                  index < vitals.length - 1 && "border-b border-line",
                )}
              >
                <dt className="text-[9px] tracking-[.24em] text-dim">
                  {vital.label}
                </dt>
                <dd
                  className={cn(
                    "m-0 mt-[3px] font-display text-[22px]",
                    vital.accent && "text-ac2",
                    vital.numeric && "tabular-nums",
                  )}
                >
                  {vital.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
