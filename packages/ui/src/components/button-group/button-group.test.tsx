// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Button, ButtonGroup } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("ButtonGroup", () => {
  it("exposes a group role and orientation state", () => {
    const container = renderInDocument(
      <ButtonGroup orientation="vertical" aria-label="Actions">
        <Button>Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>,
    );
    const group = container.querySelector<HTMLElement>('[data-jaci-component="button-group"]');
    expect(group?.getAttribute("role")).toBe("group");
    expect(group?.dataset.orientation).toBe("vertical");
  });
});
