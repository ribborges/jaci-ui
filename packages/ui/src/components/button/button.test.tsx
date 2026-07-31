// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Button", () => {
  it("renders a native link through render without requiring element props", () => {
    const onClick = vi.fn();
    const container = renderInDocument(
      <Button onClick={onClick} render={<a href="mailto:contato@example.com" />}>
        Contact
      </Button>,
    );

    const link = container.querySelector<HTMLAnchorElement>('a[data-jaci-component="button"]');
    expect(link).not.toBeNull();
    expect(link?.className).toContain("button");
    expect(link?.href).toContain("mailto:contato@example.com");

    act(() => link?.click());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("prevents activation when a rendered link is disabled", () => {
    const onClick = vi.fn();
    const container = renderInDocument(
      <Button disabled onClick={onClick} render={<a href="/disabled" />}>
        Disabled
      </Button>,
    );

    const link = container.querySelector<HTMLAnchorElement>("a");
    expect(link?.getAttribute("aria-disabled")).toBe("true");
    act(() => link?.click());
    expect(onClick).not.toHaveBeenCalled();
  });
});
