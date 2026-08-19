/**
 * Amber ring that rides the leading edge of the ripple out from the focal
 * point. Centring lives on the wrapper so anime.js owns the ring's transform
 * outright, rather than racing Tailwind for it.
 */
export function Shockwave() {
  return (
    <div
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="gate-shockwave glow-edge block size-[42vmax] rounded-full border border-ac opacity-0" />
    </div>
  );
}
