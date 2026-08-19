import { cn } from "@/lib/cn";

interface DisplayTextProps {
  readonly children: React.ReactNode;
  /** `origin-center` where the type is centred rather than ranged left. */
  readonly className?: string;
}

/**
 * The display face: Times New Roman bold at 79% horizontal scale.
 *
 * It is a span of its own rather than a class on the heading because the
 * squeeze is a transform, and anime.js claims `style.transform` outright on
 * anything it animates — the scroll scatter, the dossier's print-in, the
 * gate's line reveal, the hero's glow. Nesting keeps the two apart: the
 * heading is free to be animated, this span is free to stay squeezed.
 *
 * Size, tracking, leading and colour stay on the heading and inherit down.
 */
export function DisplayText({ children, className }: DisplayTextProps) {
  return <span className={cn("display-type", className)}>{children}</span>;
}
