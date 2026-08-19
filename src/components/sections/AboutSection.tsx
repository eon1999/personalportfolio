import { ABOUT_PARAGRAPHS, ABOUT_PREVIEW_COUNT } from "@/data/profile";
import { ReadMore } from "@/components/ui/ReadMore";
import { SectionShell } from "./SectionShell";
import { SkillChips } from "./SkillChips";

export function AboutSection() {
  return (
    <SectionShell id="about" marker="01 / ABOUT">
      {ABOUT_PARAGRAPHS.slice(0, ABOUT_PREVIEW_COUNT).map(
        (paragraph, index) => (
          <p
            key={index}
            className="max-w-[64ch] text-pretty text-[14px] leading-[1.9] text-body"
          >
            {paragraph}
          </p>
        ),
      )}

      <SkillChips />

      <ReadMore href="/about" />
    </SectionShell>
  );
}
