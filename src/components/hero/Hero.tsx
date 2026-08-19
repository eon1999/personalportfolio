import { HERO_BIO, PROFILE } from "@/data/profile";
import { SegmentReadout } from "@/components/ui/SegmentReadout";
import { HeroName } from "./HeroName";

/** The home hero: centred name over a hairline rule. */
export function Hero({ clock }: { readonly clock: string }) {
  return (
    <section
      data-scatter
      className="border-b border-line pb-16 pt-24 text-center"
    >
      <p className="text-[10px] tracking-[.44em] text-ac">
        {PROFILE.terminal} / OPERATOR FILE
      </p>

      <HeroName />

      <div
        aria-hidden
        className="mx-auto mt-[26px] h-px w-full max-w-[640px] bg-[linear-gradient(90deg,transparent,var(--color-ac),transparent)]"
      />

      <p className="mx-auto mt-6 max-w-[56ch] text-pretty text-[13.5px] leading-[1.85] text-body-hero">
        {HERO_BIO}
      </p>

      <div className="mt-[38px] flex flex-wrap justify-center gap-[34px] text-[10px] tracking-[.22em] text-dim">
        <span>{PROFILE.location}</span>
        <span aria-hidden className="text-line">
          /
        </span>
        <span>B.S. CS 2028</span>
        <span aria-hidden className="text-line">
          /
        </span>
        <span className="text-ac2">● {PROFILE.status}</span>
        <span aria-hidden className="text-line">
          /
        </span>
        <SegmentReadout
          value={clock || "00:00:00"}
          height={13}
          className="lcd"
          label={`Local time ${clock}`}
        />
      </div>
    </section>
  );
}
