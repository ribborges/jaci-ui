// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Field, Input } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Field", () => {
  it("connects label, description and external errors to its control", () => {
    const container = renderInDocument(
      <Field errors="Required" pending>
        <Field.Label>Name</Field.Label>
        <Input />
        <Field.Description>Public name</Field.Description>
        <Field.Error />
      </Field>,
    );
    const input = container.querySelector<HTMLInputElement>("input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("aria-describedby")).toContain("description");
    expect(container.querySelector("[role='alert']")?.textContent).toBe("Required");
    expect(container.querySelector("[data-slot='field']")?.getAttribute("aria-busy")).toBe("true");
  });
});
