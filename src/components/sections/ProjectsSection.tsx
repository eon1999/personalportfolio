import { ProjectsCarousel } from "@/components/projects/ProjectsCarousel";

/**
 * Projects break out of the two-column section skeleton the rest of the page
 * uses: the bay is its own gridded panel, cut into the page. Its entrance and
 * exit ride the site-wide scatter, so it arrives on the same terms as every
 * other block.
 */
export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="scroll-mt-[60px] border-b border-line pb-14 pt-14"
    >
      <div
        data-scatter-item
        className="flex flex-wrap items-baseline justify-between gap-3"
      >
        <h2 className="section-marker">02 / PROJECTS</h2>
        <p className="text-[9.5px] tracking-[.2em] text-dim">
          ◀ ▶ TO CYCLE UNITS
        </p>
      </div>

      <div data-scatter-item className="mt-6">
        <ProjectsCarousel />
      </div>
    </section>
  );
}
