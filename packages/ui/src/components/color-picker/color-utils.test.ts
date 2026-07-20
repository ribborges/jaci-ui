import { describe, expect, it } from "vitest";

import { defaultColor, formatColor, parseColor } from "./color-utils";

describe("color conversion", () => {
  it("parses short and alpha hex values", () => {
    const shortHex = parseColor("#369");
    const alphaHex = parseColor("#33669980");
    expect(shortHex).not.toBeNull();
    expect(alphaHex).not.toBeNull();
    expect(formatColor(shortHex ?? defaultColor(), "hex")).toBe("#336699");
    expect(formatColor(alphaHex ?? defaultColor(), "rgb", true)).toBe("rgba(51, 102, 153, 0.502)");
  });

  it("parses rgb and hsl values", () => {
    const rgb = parseColor("rgb(37, 99, 235)");
    const hsl = parseColor("hsl(217, 83%, 53%)");
    expect(rgb).not.toBeNull();
    expect(hsl).not.toBeNull();
    expect(formatColor(rgb ?? defaultColor(), "hex")).toBe("#2563eb");
    expect(formatColor(hsl ?? defaultColor(), "hsl")).toBe("hsl(217, 83%, 53%)");
  });

  it("formats alpha according to the requested output format", () => {
    const color = defaultColor("rgba(37, 99, 235, 0.75)");
    expect(formatColor(color, "hex", true)).toBe("#2563ebbf");
    expect(formatColor(color, "rgb", true)).toBe("rgba(37, 99, 235, 0.75)");
    expect(formatColor(color, "hsl", true)).toContain("hsla(");
  });

  it("returns null for unsupported or malformed colors", () => {
    expect(parseColor("rebeccapurple")).toBeNull();
    expect(parseColor("#12")).toBeNull();
    expect(parseColor("rgb(nope, 0, 0)")).toBeNull();
  });
});
