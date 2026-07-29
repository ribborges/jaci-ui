// @vitest-environment jsdom

import { act } from "react";
import type { ComponentProps } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Carousel } from "../../index";
import { renderInDocument } from "../../test-utils/react";

function Example(props: ComponentProps<typeof Carousel.Root>) {
  return (
    <Carousel.Root aria-label="Example carousel" {...props}>
      <Carousel.Viewport>
        <Carousel.Track>
          <Carousel.Item index={0}>First</Carousel.Item>
          <Carousel.Item index={1}>Second</Carousel.Item>
          <Carousel.Item index={2}>Third</Carousel.Item>
        </Carousel.Track>
      </Carousel.Viewport>
      <Carousel.Previous />
      <Carousel.Next />
      <Carousel.Indicators />
    </Carousel.Root>
  );
}

describe("Carousel", () => {
  it("supports controlled navigation and accessible slide state", () => {
    const onIndexChange = vi.fn();
    const container = renderInDocument(<Example defaultIndex={0} onIndexChange={onIndexChange} />);
    const next = container.querySelector<HTMLButtonElement>('[data-slot="carousel-next"]');
    if (!next) throw new Error("Carousel next control was not rendered.");
    act(() => next.click());
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(container.querySelector('[data-index="0"]')?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders distinct previous and next controls", () => {
    const container = renderInDocument(<Example />);
    const previous = container.querySelector<HTMLButtonElement>('[data-slot="carousel-previous"]');
    const next = container.querySelector<HTMLButtonElement>('[data-slot="carousel-next"]');

    expect(previous).not.toBeNull();
    expect(next).not.toBeNull();
    expect(previous?.getAttribute("aria-label")).toBe("Previous slide");
    expect(next?.getAttribute("aria-label")).toBe("Next slide");
  });

  it("uses vertical arrow controls for vertical carousels", () => {
    const container = renderInDocument(<Example orientation="vertical" />);
    const previous = container.querySelector<HTMLButtonElement>('[data-slot="carousel-previous"]');
    const next = container.querySelector<HTMLButtonElement>('[data-slot="carousel-next"]');

    expect(previous?.textContent).toBe("↑");
    expect(next?.textContent).toBe("↓");
  });

  it("moves with keyboard arrows and renders indicators", () => {
    const onIndexChange = vi.fn();
    const container = renderInDocument(<Example onIndexChange={onIndexChange} />);
    const root = container.querySelector<HTMLElement>('[data-jaci-component="carousel"]');
    if (!root) throw new Error("Carousel root was not rendered.");
    act(() =>
      root.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" })),
    );
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(container.querySelectorAll('[data-slot="carousel-indicator"]')).toHaveLength(3);
  });

  it("renders without browser APIs during SSR", () => {
    const html = renderToString(<Example />);
    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).toContain("First");
  });
});
