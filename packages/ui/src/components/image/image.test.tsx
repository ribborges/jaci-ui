// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Image } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Image", () => {
  it("renders an accessible native image and exposes lifecycle state", () => {
    const onStatusChange = vi.fn();
    const container = renderInDocument(
      <Image alt="Jaci logo" onStatusChange={onStatusChange} src="/logo.svg" />,
    );
    const image = container.querySelector("img");

    expect(image?.getAttribute("alt")).toBe("Jaci logo");
    expect(container.querySelector('[data-status="loading"]')).not.toBeNull();

    act(() => image?.dispatchEvent(new Event("load")));
    expect(container.querySelector('[data-status="loaded"]')).not.toBeNull();
    expect(onStatusChange).toHaveBeenCalledWith("loaded");
  });

  it("renders fallback content after an image error", () => {
    const container = renderInDocument(
      <Image alt="Unavailable" fallback={<span>Unavailable image</span>} src="/missing.svg" />,
    );
    const image = container.querySelector("img");

    act(() => image?.dispatchEvent(new Event("error")));
    expect(container.querySelector('[data-slot="image-fallback"]')?.textContent).toBe(
      "Unavailable image",
    );
  });

  it("opens a configurable lightbox from the image trigger", () => {
    const container = renderInDocument(<Image alt="Preview" lightbox src="/preview.svg" />);

    act(() => container.querySelector<HTMLButtonElement>('[data-slot="image-trigger"]')?.click());

    expect(document.body.querySelector('[data-slot="image-lightbox-content"]')).not.toBeNull();
    expect(document.body.querySelector('[data-slot="image-lightbox-close"]')).not.toBeNull();
  });
});
