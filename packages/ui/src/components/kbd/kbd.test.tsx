// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Kbd } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Kbd", () => {
  it("renders a keyboard semantic element with stable state attributes", () => {
    const container = renderInDocument(<Kbd variant="outline">Ctrl</Kbd>);
    const element = container.querySelector("kbd");

    expect(element?.textContent).toBe("Ctrl");
    expect(element?.getAttribute("data-variant")).toBe("outline");
  });
});
