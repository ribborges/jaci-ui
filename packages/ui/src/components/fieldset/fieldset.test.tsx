// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Fieldset, Input } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Fieldset", () => {
  it("keeps native fieldset disabling and its labelled composition", () => {
    const container = renderInDocument(
      <Fieldset.Root disabled>
        <Fieldset.Legend>Profile</Fieldset.Legend>
        <Fieldset.Description>Details</Fieldset.Description>
        <Input aria-label="Name" />
      </Fieldset.Root>,
    );
    expect(container.querySelector("fieldset")?.disabled).toBe(true);
    expect(container.querySelector("[data-slot='fieldset-legend']")?.textContent).toBe("Profile");
    expect(container.querySelector("[data-slot='fieldset-description']")?.textContent).toBe(
      "Details",
    );
  });
});
