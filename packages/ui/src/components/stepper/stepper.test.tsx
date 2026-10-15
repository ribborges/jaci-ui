// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Stepper } from "../../index";
import { renderInDocument } from "../../test-utils/react";

function Example(props: { onValueChange?: (value: string) => void; value?: string }) {
  return (
    <Stepper.Root {...props} name="checkout-step">
      <Stepper.List>
        <Stepper.Item value="account">
          <Stepper.Trigger>
            <Stepper.Indicator />
            <Stepper.Title>Account</Stepper.Title>
          </Stepper.Trigger>
          <Stepper.Separator />
        </Stepper.Item>
        <Stepper.Item value="payment">
          <Stepper.Trigger>
            <Stepper.Indicator />
            <Stepper.Title>Payment</Stepper.Title>
          </Stepper.Trigger>
        </Stepper.Item>
      </Stepper.List>
      <Stepper.Content value="account">Account content</Stepper.Content>
      <Stepper.Content value="payment">Payment content</Stepper.Content>
      <Stepper.Next />
    </Stepper.Root>
  );
}

describe("Stepper", () => {
  it("derives statuses and submits the active step", () => {
    const container = renderInDocument(<Example />);
    expect(container.querySelector('[data-value="account"]')?.getAttribute("data-status")).toBe(
      "current",
    );
    expect(container.querySelector('input[name="checkout-step"]')?.getAttribute("value")).toBe(
      "account",
    );
  });

  it("supports controlled navigation and previous/next buttons", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(<Example value="account" onValueChange={onValueChange} />);
    const next = container.querySelector<HTMLButtonElement>('[data-slot="stepper-next"]');
    if (!next) throw new Error("Stepper next button was not rendered.");
    act(() => next.click());
    expect(onValueChange).toHaveBeenCalledWith("payment");
  });

  it("shows only the active step content", () => {
    const container = renderInDocument(<Example />);
    const accountContent = container.querySelector<HTMLElement>(
      '[data-slot="stepper-content"][data-value="account"]',
    );
    const paymentContent = container.querySelector<HTMLElement>(
      '[data-slot="stepper-content"][data-value="payment"]',
    );
    const payment = container.querySelector<HTMLButtonElement>(
      '[data-value="payment"] [data-slot="stepper-trigger"]',
    );
    if (!accountContent || !paymentContent || !payment) {
      throw new Error("Stepper content and trigger were not rendered.");
    }

    expect(accountContent.hidden).toBe(false);
    expect(paymentContent.hidden).toBe(true);
    act(() => payment.click());
    expect(accountContent.hidden).toBe(true);
    expect(paymentContent.hidden).toBe(false);
  });

  it("supports the deprecated content nested in a step item", () => {
    const container = renderInDocument(
      <Stepper.Root defaultValue="account">
        <Stepper.List>
          <Stepper.Item value="account">
            <Stepper.Trigger>Account</Stepper.Trigger>
            <Stepper.Content>Account content</Stepper.Content>
          </Stepper.Item>
          <Stepper.Item value="payment">
            <Stepper.Trigger>Payment</Stepper.Trigger>
            <Stepper.Content>Payment content</Stepper.Content>
          </Stepper.Item>
        </Stepper.List>
      </Stepper.Root>,
    );
    const accountContent = container.querySelector<HTMLElement>(
      '[data-slot="stepper-content"][data-value="account"]',
    );
    const paymentContent = container.querySelector<HTMLElement>(
      '[data-slot="stepper-content"][data-value="payment"]',
    );
    const payment = container.querySelector<HTMLButtonElement>(
      '[data-value="payment"] [data-slot="stepper-trigger"]',
    );
    if (!accountContent || !paymentContent || !payment) {
      throw new Error("Legacy Stepper content and trigger were not rendered.");
    }

    expect(accountContent.getAttribute("data-legacy-content")).toBe("true");
    expect(accountContent.hidden).toBe(false);
    expect(paymentContent.hidden).toBe(true);
    act(() => payment.click());
    expect(accountContent.hidden).toBe(true);
    expect(paymentContent.hidden).toBe(false);
  });

  it("keeps indicator numbering opt-in", () => {
    const defaultContainer = renderInDocument(<Example />);
    expect(
      defaultContainer.querySelector('[data-slot="stepper"]')?.getAttribute("data-show-numbers"),
    ).toBeNull();

    const numberedContainer = renderInDocument(
      <Stepper.Root defaultValue="account" showNumbers>
        <Stepper.List>
          <Stepper.Item value="account">
            <Stepper.Trigger>
              <Stepper.Indicator />
              Account
            </Stepper.Trigger>
          </Stepper.Item>
        </Stepper.List>
      </Stepper.Root>,
    );
    expect(
      numberedContainer.querySelector('[data-slot="stepper"]')?.getAttribute("data-show-numbers"),
    ).toBe("true");
  });

  it("keeps the completion checkmark when numbering is enabled", () => {
    const container = renderInDocument(
      <Stepper.Root defaultValue="account" showNumbers>
        <Stepper.List>
          <Stepper.Item value="account">
            <Stepper.Trigger>
              <Stepper.Indicator />
              Account
            </Stepper.Trigger>
          </Stepper.Item>
          <Stepper.Item value="payment">
            <Stepper.Trigger>
              <Stepper.Indicator />
              Payment
            </Stepper.Trigger>
          </Stepper.Item>
        </Stepper.List>
      </Stepper.Root>,
    );
    const payment = container.querySelector<HTMLButtonElement>(
      '[data-value="payment"] [data-slot="stepper-trigger"]',
    );
    const accountIndicator = container.querySelector<HTMLElement>(
      '[data-value="account"] [data-slot="stepper-indicator"]',
    );
    if (!payment || !accountIndicator) throw new Error("Stepper indicators were not rendered.");

    act(() => payment.click());
    expect(accountIndicator.textContent).toBe("✓");
  });

  it("does not allow disabled steps to be selected", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <Stepper.Root defaultValue="account" onValueChange={onValueChange}>
        <Stepper.List>
          <Stepper.Item value="account">
            <Stepper.Trigger>Account</Stepper.Trigger>
          </Stepper.Item>
          <Stepper.Item value="payment" disabled>
            <Stepper.Trigger>Payment</Stepper.Trigger>
          </Stepper.Item>
        </Stepper.List>
      </Stepper.Root>,
    );
    const trigger = container.querySelector<HTMLButtonElement>(
      '[data-value="payment"] [data-slot="stepper-trigger"]',
    );
    if (!trigger) throw new Error("Disabled step trigger was not rendered.");
    act(() => trigger.click());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("keeps next and keyboard navigation available when direct selection is disabled", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <Stepper.Root defaultValue="account" allowStepSelect={false} onValueChange={onValueChange}>
        <Stepper.List>
          <Stepper.Item value="account">
            <Stepper.Trigger>Account</Stepper.Trigger>
          </Stepper.Item>
          <Stepper.Item value="payment">
            <Stepper.Trigger>Payment</Stepper.Trigger>
          </Stepper.Item>
          <Stepper.Item value="review">
            <Stepper.Trigger>Review</Stepper.Trigger>
          </Stepper.Item>
        </Stepper.List>
        <Stepper.Next />
      </Stepper.Root>,
    );
    const next = container.querySelector<HTMLButtonElement>('[data-slot="stepper-next"]');
    const account = container.querySelector<HTMLButtonElement>(
      '[data-value="account"] [data-slot="stepper-trigger"]',
    );
    if (!next || !account) throw new Error("Stepper controls were not rendered.");

    act(() => next.click());
    expect(onValueChange).toHaveBeenLastCalledWith("payment");
    act(() => {
      account.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    });
    expect(onValueChange).toHaveBeenLastCalledWith("review");
  });
});
