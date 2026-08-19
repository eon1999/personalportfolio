import type { Metadata } from "next";
import { PageGate } from "@/components/gate/PageGate";
import { ReturnAction } from "@/components/chrome/ReturnAction";
import { SiteFrame } from "@/components/chrome/SiteFrame";
import { PageHeader } from "@/components/sections/PageHeader";
import { WritingFeed } from "@/components/sections/WritingFeed";
import { WRITING } from "@/data/writing";

export const metadata: Metadata = {
  title: "Writing — V. DANG",
  description: "Notes and write-ups by Viet-Anh Dang.",
};

export default function WritingPage() {
  return (
    <PageGate>
      <SiteFrame action={<ReturnAction />}>
        <PageHeader
          marker="FILE / 03 — WRITING"
          title="WRITING"
          lede="Notes on things I've built and things I've read. Newest first."
        />

        <section className="grid grid-cols-1 gap-6 pb-[90px] pt-14 wide:grid-cols-[180px_1fr] wide:gap-[34px]">
          <h2 className="text-[10px] tracking-[.28em] text-ac">
            {`ALL ENTRIES / ${String(WRITING.length).padStart(3, "0")}`}
          </h2>
          <WritingFeed entries={WRITING} />
        </section>
      </SiteFrame>
    </PageGate>
  );
}
