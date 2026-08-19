import { SKILLS } from "@/data/profile";

export function SkillChips() {
  return (
    <ul className="mt-[26px] flex list-none flex-wrap gap-[7px] p-0">
      {SKILLS.map((skill) => (
        <li
          key={skill}
          className="chip px-[11px] py-[6px] text-[10px] tracking-[.16em]"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
