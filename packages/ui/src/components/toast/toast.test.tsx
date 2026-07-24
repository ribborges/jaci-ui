// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { Toast } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Toast", () => {
  it("renders a declarative toast and dismisses it through Close", () => {
    const container = renderInDocument(
      <Toast.Provider timeout={0}>
        <Toast.Portal>
          <Toast.Viewport>
            <Toast.Root toast={{ id: "saved", title: "Saved", description: "Changes saved" }}>
              <Toast.Content>
                <Toast.Text>
                  <Toast.Title />
                  <Toast.Description />
                </Toast.Text>
                <Toast.Close />
              </Toast.Content>
            </Toast.Root>
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>,
    );

    expect(document.body.textContent).toContain("Saved");
    const close = document.querySelector<HTMLButtonElement>('[data-slot="toast-close"]');
    if (!close) throw new Error("Toast close button was not rendered.");
    act(() => close.click());
    expect(close.getAttribute("aria-label")).toBe("Dismiss notification");
    expect(container).toBeTruthy();
  });
});
