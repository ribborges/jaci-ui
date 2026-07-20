// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Copyable } from "../../index";
import { renderInDocument } from "../../test-utils/react";

function renderCopyable(props: Partial<React.ComponentProps<typeof Copyable.Root>> = {}) {
  const container = renderInDocument(
    <Copyable.Root value="pnpm add jaci-ui" {...props}>
      <Copyable.Content>pnpm add jaci-ui</Copyable.Content>
      <Copyable.Indicator />
    </Copyable.Root>,
  );

  const button = container.querySelector<HTMLButtonElement>("button");
  if (!button) {
    throw new Error("Copyable did not render its button root.");
  }

  return { button, container };
}

describe("Copyable", () => {
  it("copies through the Clipboard API and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const onCopy = vi.fn();
    const { button } = renderCopyable({ onCopy });

    await act(async () => {
      button.click();
    });

    expect(writeText).toHaveBeenCalledWith("pnpm add jaci-ui");
    expect(onCopy).toHaveBeenCalledWith("pnpm add jaci-ui");
    expect(button.dataset.copied).toBe("true");
    expect(button.querySelector('[aria-live="polite"]')?.textContent).toBe("Copied");
  });

  it("uses the document fallback when Clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
    const onCopy = vi.fn();
    const { button } = renderCopyable({ onCopy });

    await act(async () => {
      button.click();
    });

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(onCopy).toHaveBeenCalledWith("pnpm add jaci-ui");
  });

  it("reports clipboard failures without entering the copied state", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });
    const onError = vi.fn();
    const { button } = renderCopyable({ onError });

    await act(async () => {
      button.click();
    });

    expect(onError).toHaveBeenCalledOnce();
    expect(button.dataset.copied).toBeUndefined();
  });
});
