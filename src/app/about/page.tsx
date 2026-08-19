import type { Metadata } from "next";
import Link from "next/link";
import { PageGate } from "@/components/gate/PageGate";
import { ReturnAction } from "@/components/chrome/ReturnAction";
import { SiteFrame } from "@/components/chrome/SiteFrame";
import { PageHeader } from "@/components/sections/PageHeader";
import { SkillChips } from "@/components/sections/SkillChips";
import { DisplayText } from "@/components/ui/DisplayText";
import { ABOUT_PARAGRAPHS, PROFILE } from "@/data/profile";
import { RECORD } from "@/data/record";

export const metadata: Metadata = {
  title: "About — V. DANG",
  description:
    "Viet-Anh Dang — CS at UT Austin, machine learning research at the Oden Institute, and work sitting between research and infrastructure.",
};

export default function AboutPage() {
  const postings = RECORD.filter((entry) => entry.period.includes("PRESENT"));

  return (
    <PageGate>
      <SiteFrame action={<ReturnAction />}>
        <PageHeader marker="FILE / 01 — ABOUT" title="ABOUT" />

        <section className="grid grid-cols-1 gap-6 border-b border-line pb-14 pt-14 wide:grid-cols-[180px_1fr] wide:gap-[34px]">
          <h2 className="section-marker">RECORD</h2>
          <div>
            {ABOUT_PARAGRAPHS.map((paragraph, index) => (
              <p
                key={index}
                className={
                  "max-w-[64ch] text-pretty text-[14px] leading-[1.9] text-body" +
                  (index > 0 ? " mt-[18px]" : "")
                }
              >
                {paragraph}
              </p>
            ))}
            <SkillChips />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 border-b border-line pb-14 pt-14 wide:grid-cols-[180px_1fr] wide:gap-[34px]">
          <h2 className="section-marker">
            CURRENT POSTINGS
          </h2>
          <div>
            {postings.map((posting, index) => (
              <div
                key={posting.id}
                className={
                  "grid grid-cols-1 gap-[18px] wide:grid-cols-[130px_1fr]" +
                  (index === 0 ? " pb-5" : " py-5") +
                  (index < postings.length - 1 ? " border-b border-line" : "")
                }
              >
                <p className="text-[10.5px] tracking-[.1em] text-dim">
                  {posting.period}
                </p>
                <div>
                  <h3 className="text-[20px]">
                    <DisplayText>{posting.role}</DisplayText>
                  </h3>
                  <p className="mt-[3px] text-[12px] text-dim">{posting.org}</p>
                </div>
              </div>
            ))}
            <p className="mt-[18px] text-[10.5px] tracking-[.2em]">
              <Link href="/#resume">FULL RECORD →</Link>
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 pb-[90px] pt-14 wide:grid-cols-[180px_1fr] wide:gap-[34px]">
          <h2 className="section-marker">CONTACT</h2>
          <div>
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-block border-b border-ac pb-[3px] font-mono text-[17px]"
            >
              {PROFILE.email}
            </a>
            <p className="mt-3 text-[13px] text-dim">{PROFILE.phone}</p>
          </div>
        </section>
      </SiteFrame>
    </PageGate>
  );
}
