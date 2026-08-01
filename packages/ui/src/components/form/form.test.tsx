// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Field, Form, Input } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Form", () => {
  it("supplies server errors to named fields and submits through Base UI", () => {
    const container = renderInDocument(
      <Form errors={{ email: "Invalid email" }} onFormSubmit={() => undefined}>
        <Field name="email">
          <Input name="email" />
          <Field.Error />
        </Field>
        <button type="submit">Send</button>
      </Form>,
    );
    expect(container.querySelector("[role='alert']")?.textContent).toBe("Invalid email");
    expect(container.querySelector("form")?.dataset.jaciComponent).toBe("form");
  });
});
