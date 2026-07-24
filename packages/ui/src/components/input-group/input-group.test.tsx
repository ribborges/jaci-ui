// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Input, InputGroup } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("InputGroup", () => {
  it("composes addons and controls without losing stable slots", () => {
    const container = renderInDocument(
      <InputGroup.Root>
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="URL" />
      </InputGroup.Root>,
    );
    expect(container.querySelector('[data-jaci-component="input-group"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="input-group-addon"]')?.textContent).toBe(
      "https://",
    );
  });

  it("can be used directly as the root component", () => {
    const container = renderInDocument(
      <InputGroup>
        <InputGroup.Addon>Search</InputGroup.Addon>
        <Input aria-label="Search" />
      </InputGroup>,
    );
    expect(container.querySelector('[data-jaci-component="input-group"]')).not.toBeNull();
  });
});
