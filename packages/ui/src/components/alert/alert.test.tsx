import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Alert } from "../../index";

describe("Alert", () => {
  it("renders its semantic slots and tone during SSR", () => {
    const html = renderToString(
      <Alert.Root tone="warning">
        <Alert.Icon />
        <Alert.Title>Attention</Alert.Title>
        <Alert.Description>Review this action.</Alert.Description>
        <Alert.Actions>Retry</Alert.Actions>
      </Alert.Root>,
    );

    expect(html).toContain('data-jaci-component="alert"');
    expect(html).toContain('data-jaci-tone="warning"');
    expect(html).toContain('data-slot="alert-title"');
    expect(html).toContain('role="alert"');
  });
});
