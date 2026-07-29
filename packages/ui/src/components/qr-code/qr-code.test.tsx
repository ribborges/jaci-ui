import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { QRCode } from "../../index";

describe("QRCode", () => {
  it("renders a deterministic SVG with circular modules and rounded eyes", () => {
    const html = renderToString(<QRCode label="Jaci website" value="https://jaci-ui.dev" />);
    expect(html).toContain("<svg");
    expect(html).toContain('data-dot-shape="circle"');
    expect(html).toContain('data-eye-shape="rounded-square"');
    expect(html).toContain('data-slot="qr-code-dot"');
    expect(html).toContain('data-slot="qr-code-eye"');
    expect(html).toContain('aria-label="Jaci website"');
    expect(html).toContain('fill="white"');
  });

  it("renders an accessible fallback for values that exceed QR capacity", () => {
    const html = renderToString(<QRCode fallback="Too long" value={"x".repeat(5000)} />);
    expect(html).toContain("Too long");
    expect(html).toContain('data-status="error"');
  });
});
