/**
 * Whether the visitor has already been through a gate this page load.
 *
 * Module state, deliberately — it survives client-side navigation (so returning
 * to the home page from a sub-page doesn't force the boot sequence again) but
 * resets on a reload, which is when the standby screen is supposed to come up.
 * Only ever written from the client, so the server's copy stays false.
 */
let gated = false;

export function markGated(): void {
  gated = true;
}

export function hasBeenGated(): boolean {
  return gated;
}

/**
 * Whether the home page is being handed the screen mid-transition, rather than
 * being navigated to cold.
 *
 * `RETURN TO TERMINAL` seals the screen black on the sub-page and only then
 * swaps routes, so the home page has to come up already covered and ripple
 * itself open — otherwise the seal hard-cuts to the site. Same module-state
 * reasoning as `gated`: it needs to survive exactly one client-side navigation.
 */
let handingBack = false;

export function markHandback(): void {
  handingBack = true;
}

export function hasHandback(): boolean {
  return handingBack;
}

/** Called by whoever picked the handback up, so it plays on one mount only. */
export function clearHandback(): void {
  handingBack = false;
}
