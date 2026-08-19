import { cn } from "@/lib/cn";

/** The insignia mark — a CSS clip-path triangle, no asset. */
export function Triangle({ className }: { readonly className?: string }) {
  return <span aria-hidden className={cn("tri block bg-ac", className)} />;
}
