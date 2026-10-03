/**
 * overlay-size.ts — How much of the terminal this extension's overlays fill.
 *
 * The conversation viewer, the fleet list's overlay for one agent, and the
 * workflow inspector all open at the same size, so the numbers live here rather
 * than at each call site: the workflow inspector is reached from both, and a
 * frame that opens at a different size than the one beside it reads as two UIs.
 *
 * Two shares, one per axis, because the content differs by axis. Width carries
 * transcripts and diffs, which want every column available. Height carries the
 * header, the transcript and the footer hint, and a tall frame on a short
 * terminal pushes the prompt off screen entirely.
 */

import type { OverlayOptions } from "@earendil-works/pi-tui";

/** Default share of the terminal an overlay fills, on either axis. */
export const OVERLAY_SIZE_PCT_DEFAULT = 85;

/** Under this the header and footer wrap away, leaving only the transcript. */
export const OVERLAY_PCT_FLOOR = 20;
/** Past this there is no surrounding context left to read against. */
export const OVERLAY_PCT_CEILING = 100;

let widthPct = OVERLAY_SIZE_PCT_DEFAULT;
let heightPct = OVERLAY_SIZE_PCT_DEFAULT;

/** Whole percent, kept inside the range that still renders a usable frame. */
function clampPct(n: number): number {
  return Math.min(OVERLAY_PCT_CEILING, Math.max(OVERLAY_PCT_FLOOR, Math.round(n)));
}

export function setOverlayWidthPct(n: number): void {
  widthPct = clampPct(n);
}

export function setOverlayHeightPct(n: number): void {
  heightPct = clampPct(n);
}

export function getOverlayWidthPct(): number {
  return widthPct;
}

export function getOverlayHeightPct(): number {
  return heightPct;
}

/**
 * Options for `ctx.ui.custom(..., { overlay: true, overlayOptions })`, on the
 * same anchor for every surface. Resolved when an overlay opens — pi reads it
 * once, so a change lands on the next overlay rather than the visible one.
 */
export function overlayFrame(): OverlayOptions {
  return { anchor: "center", width: `${widthPct}%`, maxHeight: `${heightPct}%` };
}

/**
 * Rows an overlay may fill on a terminal this many rows tall. Matches how
 * pi-tui resolves a percentage `maxHeight`, so the viewer's line budget and the
 * frame's ceiling cannot disagree and clip the footer. `pct` lets a caller keep
 * the share it saw when its overlay opened; omitted → the current value.
 */
export function overlayRows(terminalRows: number, pct: number = heightPct): number {
  return Math.floor((terminalRows * pct) / 100);
}
