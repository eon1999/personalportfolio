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
        className="inline-block border border-line px-[18px] py-[9px] text-[10.5px] tracking-[.2em] text-ac transition-colors duration-[var(--t-hover)] ease-out hover:border-ac hover:bg-ac hover:text-black"
      >
        {children} →
      </Link>
    </p>
  );
}
