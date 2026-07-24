// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { IconButton } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("IconButton", () => {
  it("keeps icon buttons accessible and exposes stable state attributes", () => {
    const container = renderInDocument(<IconButton aria-label="Close">×</IconButton>);
    const button = container.querySelector("button");
    expect(button?.getAttribute("aria-label")).toBe("Close");
    expect(button?.dataset.jaciComponent).toBe("icon-button");
  });

  it("requires an accessible name for icon-only content", () => {
    expect(() =>
      renderInDocument(
        <IconButton>
          <svg aria-hidden="true" viewBox="0 0 16 16">
            <path d="M0 0h16v16H0z" />
          </svg>
        </IconButton>,
      ),
    ).toThrow("aria-label");
  });
});
