import { describe, expect, it } from "vitest";
import {
  getOverlayHeightPct,
  getOverlayWidthPct,
  OVERLAY_PCT_CEILING,
  OVERLAY_PCT_FLOOR,
  OVERLAY_SIZE_PCT_DEFAULT,
  overlayFrame,
  overlayRows,
  setOverlayHeightPct,
  setOverlayWidthPct,
} from "../src/ui/overlay-size.js";

/**
 * The sizing module is the single source for every overlay this extension opens,
 * so its defaults are the shipped frame size: both axes at 85% of the terminal.
 * The setters mutate module state, so each case starts from a known pair.
 */
describe("overlay sizing", () => {
  it("defaults both axes to 85% of the terminal", () => {
    expect(OVERLAY_SIZE_PCT_DEFAULT).toBe(85);
    setOverlayWidthPct(OVERLAY_SIZE_PCT_DEFAULT);
    setOverlayHeightPct(OVERLAY_SIZE_PCT_DEFAULT);
    expect(overlayFrame()).toEqual({ anchor: "center", width: "85%", maxHeight: "85%" });
  });

  it("sizes the two axes independently", () => {
    setOverlayWidthPct(100);
    setOverlayHeightPct(60);
    expect(getOverlayWidthPct()).toBe(100);
    expect(getOverlayHeightPct()).toBe(60);
    expect(overlayFrame()).toEqual({ anchor: "center", width: "100%", maxHeight: "60%" });
  });

  it("clamps to the usable range, whole percent", () => {
    setOverlayHeightPct(5);
    expect(getOverlayHeightPct()).toBe(OVERLAY_PCT_FLOOR);
    setOverlayHeightPct(140);
    expect(getOverlayHeightPct()).toBe(OVERLAY_PCT_CEILING);
    setOverlayWidthPct(82.6);
    expect(getOverlayWidthPct()).toBe(83);
  });

  it("budgets rows from the height share, rounded down", () => {
    setOverlayHeightPct(85);
    // 85% of 40 rows, and the floor matters: 85% of 30 is 25.5.
    expect(overlayRows(40)).toBe(34);
    expect(overlayRows(30)).toBe(25);
  });
});
