import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Alert, Badge } from "../../index";

describe("Feedback", () => {
  it("renders badge variants and alert feedback with stable markers", () => {
    const html = renderToString(
      <>
        <Badge tone="success" variant="soft">
          Saved
        </Badge>
        <Alert.Root tone="success">
          <Alert.Title>Saved</Alert.Title>
        </Alert.Root>
      </>,
    );

    expect(html).toContain('data-jaci-component="badge"');
    expect(html).toContain('data-variant="soft"');
    expect(html).toContain('data-jaci-component="alert"');
  });

  it("leaves custom badge colors to the consumer's class", () => {
    const html = renderToString(
      <Badge tone="custom" variant="solid" className="brand-badge">
        Brand
      </Badge>,
    );

    expect(html).toContain("jaci-badge--tone_custom-solid");
    expect(html).toContain("brand-badge");
    expect(html).toContain('data-jaci-tone="custom"');
  });
});
