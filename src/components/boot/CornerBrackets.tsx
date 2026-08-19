/** Four amber L-brackets framing the boot overlay. */
export function CornerBrackets() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute left-[26px] top-[22px] size-[26px] border-l border-t border-ac" />
      <span className="absolute right-[26px] top-[22px] size-[26px] border-r border-t border-ac" />
      <span className="absolute bottom-[22px] left-[26px] size-[26px] border-b border-l border-ac" />
      <span className="absolute bottom-[22px] right-[26px] size-[26px] border-b border-r border-ac" />
    </div>
  );
}
