/** Where the teeth sit, in degrees around the ring. */
const TEETH = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * The settings mark, drawn in the HUD's own language rather than as a solid
 * gear: a hairline ring with eight teeth struck through it and a bearing at
 * the centre — the same construction as the reticle's outer marks, so it sits
 * next to the equalizer without looking like it came from another toolbar.
 */
export function GearIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="6.4" />
      <circle cx="12" cy="12" r="2.1" />
      {TEETH.map((angle) => (
        <line
          key={angle}
          x1="12"
          y1="3.4"
          x2="12"
          y2="5.7"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}
