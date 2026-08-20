import Link from "next/link";

interface ReadMoreProps {
  readonly href: string;
  readonly children?: React.ReactNode;
}

/** The link out of a home-page preview and into its own page. */
export function ReadMore({ href, children = "READ MORE" }: ReadMoreProps) {
  return (
    <p className="mt-[26px]">
      <Link
        href={href}
        // `text-ac` clips the resting label to `--gradient-ac`, which leaves
        // `background-image` / `background-clip` / `-webkit-text-fill-color`
        // set on hover too — `hover:text-black` alone only touches `color`,
        // so the rest have to be unwound by hand or the label stays
        // (invisibly) clipped to a gradient that's no longer there.
        className="inline-block border border-line px-[18px] py-[9px] text-[10.5px] tracking-[.2em] text-ac transition-colors duration-[var(--t-hover)] ease-out hover:border-ac hover:bg-ac hover:bg-none hover:text-black hover:[background-clip:border-box] hover:[-webkit-background-clip:border-box] hover:[-webkit-text-fill-color:#000]"
      >
        {children} →
      </Link>
    </p>
  );
}
