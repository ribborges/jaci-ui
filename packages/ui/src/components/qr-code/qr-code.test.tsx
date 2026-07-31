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
    expect(html).toContain('data-slot="qr-code-eye-frame"');
    expect(html).toContain('data-slot="qr-code-eyeball"');
    expect(html).toContain('aria-label="Jaci website"');
    expect(html).toContain('fill="#18181b"');
  });

  it("keeps finder frames readable in themed scopes", () => {
    const html = renderToString(
      <section data-jaci-theme="dark" style={{ color: "white" }}>
        <QRCode value="https://example.com" />
      </section>,
    );
    expect(html.match(/data-slot="qr-code-eye"/g)).toHaveLength(3);
    expect(html.match(/data-slot="qr-code-eye-frame"/g)).toHaveLength(3);
    expect(html.match(/data-slot="qr-code-eyeball"/g)).toHaveLength(3);
    expect(html).toContain('fill="#18181b"');
    expect(html).toContain('fill="#ffffff"');
  });

  it("can expose a native SVG download link without browser APIs during SSR", () => {
    const html = renderToString(
      <QRCode
        download="example-qr.svg"
        downloadLabel="Download example QR"
        value="https://example.com"
      />,
    );
    expect(html).toContain('data-download="true"');
    expect(html).toContain('download="example-qr.svg"');
    expect(html).toContain('aria-label="Download example QR"');
    expect(html).toContain("data:image/svg+xml");
  });

  it("renders an accessible fallback for values that exceed QR capacity", () => {
    const html = renderToString(<QRCode fallback="Too long" value={"x".repeat(5000)} />);
    expect(html).toContain("Too long");
    expect(html).toContain('data-status="error"');
  });
});
