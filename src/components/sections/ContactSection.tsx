import { LINKS, PROFILE } from "@/data/profile";
import { DisplayText } from "@/components/ui/DisplayText";
import { SectionShell } from "./SectionShell";

export function ContactSection() {
  const [askLineOne, askLineTwo] = PROFILE.ask;

  return (
    <SectionShell id="contact" marker="05 / CONTACT" last>
      <p className="text-[clamp(30px,4.6vw,44px)] leading-[1.1]">
        <DisplayText hatch>
          {askLineOne}
          <br />
          {askLineTwo}
        </DisplayText>
      </p>

      <p className="mt-[22px]">
        <a
          href={`mailto:${PROFILE.email}`}
          className="inline-block border-b border-ac pb-[3px] font-mono text-[17px] text-ac"
        >
          {PROFILE.email}
        </a>
      </p>

      <p className="mt-3 text-[13px] text-dim">{PROFILE.phone}</p>

      <div className="mt-7 flex flex-wrap gap-[22px] text-[10.5px] tracking-[.2em]">
        <a href={LINKS.github} target="_blank" rel="noreferrer" className="text-ac">
          GITHUB
        </a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="text-ac">
          LINKEDIN
        </a>
      </div>
    </SectionShell>
  );
}
