import { WRITING, WRITING_FEED_LIMIT } from "@/data/writing";
import { ReadMore } from "@/components/ui/ReadMore";
import { SectionShell } from "./SectionShell";
import { WritingFeed } from "./WritingFeed";

export function WritingSection() {
  return (
    <SectionShell id="writing" marker="03 / WRITING">
      <WritingFeed entries={WRITING.slice(0, WRITING_FEED_LIMIT)} />
      <ReadMore href="/writing">ALL ENTRIES</ReadMore>
    </SectionShell>
  );
}
