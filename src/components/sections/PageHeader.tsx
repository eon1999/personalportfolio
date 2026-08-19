import { DisplayText } from "@/components/ui/DisplayText";

interface PageHeaderProps {
  /** e.g. `FILE / 01 — ABOUT` */
  readonly marker: string;
  readonly title: string;
  readonly lede?: string;
}

/** Masthead for a sub-page, echoing the home page's section markers. */
export function PageHeader({ marker, title, lede }: PageHeaderProps) {
  return (
    <header data-scatter className="border-b border-line pb-12 pt-[74px]">
      <p className="flex items-center gap-[10px] text-[10px] tracking-[.3em] text-ac">
        <span aria-hidden className="h-px w-[22px] bg-ac" />
        {marker}
      </p>
      <h1 className="mt-5 text-[clamp(38px,7vw,72px)] leading-[.98] tracking-[.01em]">
        <DisplayText>{title}</DisplayText>
      </h1>
      {lede ? (
        <p className="mt-6 max-w-[62ch] text-pretty text-[13.5px] leading-[1.85] text-body-hero">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
