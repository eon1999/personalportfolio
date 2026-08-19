"use client";

import { HERO_BIO, PROFILE } from "@/data/profile";
import { StatusPanel } from "./StatusPanel";

interface HeroAProps {
  readonly clock: string;
  readonly sync: number;
}

/** Split hero: display name on the left, live status panel on the right. */
export function HeroA({ clock, sync }: HeroAProps) {
  return (
    <section className="grid grid-cols-1 gap-8 border-b border-line pb-[60px] pt-[74px] wide:grid-cols-[1fr_300px] wide:gap-[34px]">
      <div>
        <p className="flex items-center gap-[10px] text-[10px] tracking-[.3em] text-ac">
          <span aria-hidden className="h-px w-[22px] bg-ac" />
          OPERATOR RECORD / 001
        </p>

        <h1 className="mt-5 font-display text-[clamp(46px,8.6vw,82px)] font-light leading-[.94] tracking-[-.01em]">
          {PROFILE.firstName}
          <br />
          <span className="font-semibold">{PROFILE.lastName}</span>
        </h1>

        <p className="mt-[26px] max-w-[52ch] text-pretty text-[13.5px] leading-[1.85] text-body-hero">
          {HERO_BIO.a}
        </p>

        <div className="mt-[30px] flex flex-wrap gap-[10px]">
          <a
            href="#projects"
            className="btn-ac px-[22px] py-3 text-[11px] tracking-[.2em]"
          >
            VIEW PROJECTS →
          </a>
          <a
            href="#contact"
            className="btn-ghost px-[22px] py-3 text-[11px] tracking-[.2em]"
          >
            CONTACT
          </a>
        </div>
      </div>

      <StatusPanel clock={clock} sync={sync} />
    </section>
  );
}
