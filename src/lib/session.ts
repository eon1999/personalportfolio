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
