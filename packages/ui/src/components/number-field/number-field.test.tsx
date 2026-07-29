// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { NumberField } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("NumberField", () => {
  it("keeps the input and stepper controls in one composed group", () => {
    const container = renderInDocument(
      <NumberField.Root defaultValue={2}>
        <NumberField.Group>
          <NumberField.Decrement aria-label="Decrease" />
          <NumberField.Input aria-label="Quantity" />
          <NumberField.Increment aria-label="Increase" />
        </NumberField.Group>
      </NumberField.Root>,
    );

    const group = container.querySelector('[data-slot="number-field-group"]');
    expect(group).not.toBeNull();
    expect(group?.querySelector("input")).not.toBeNull();
    expect(group?.querySelectorAll("button")).toHaveLength(2);
    expect(group?.querySelectorAll(":scope > *")).toHaveLength(3);
  });
});
