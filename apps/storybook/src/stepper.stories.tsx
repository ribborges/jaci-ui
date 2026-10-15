import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "jaci-ui";
import { useState } from "react";
import { expect } from "storybook/test";

const meta = {
  title: "Navigation/Stepper",
  tags: ["autodocs", "test"],
  component: Stepper.Root,
} satisfies Meta<typeof Stepper.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckoutStepper({
  orientation = "horizontal",
  showNumbers = false,
}: {
  orientation?: "horizontal" | "vertical";
  showNumbers?: boolean;
}) {
  const [step, setStep] = useState("account");
  return (
    <Stepper.Root
      aria-label="Checkout progress"
      orientation={orientation}
      showNumbers={showNumbers}
      value={step}
      onValueChange={setStep}
      name="checkout-step"
    >
      <Stepper.List>
        <Stepper.Item value="account">
          <Stepper.Trigger>
            <Stepper.Indicator />
            <span>
              <Stepper.Title>Account</Stepper.Title>
              <Stepper.Description>Profile details</Stepper.Description>
            </span>
          </Stepper.Trigger>
          <Stepper.Separator />
        </Stepper.Item>
        <Stepper.Item value="payment">
          <Stepper.Trigger>
            <Stepper.Indicator />
            <span>
              <Stepper.Title>Payment</Stepper.Title>
              <Stepper.Description>Billing information</Stepper.Description>
            </span>
          </Stepper.Trigger>
          <Stepper.Separator />
        </Stepper.Item>
        <Stepper.Item value="review" disabled>
          <Stepper.Trigger>
            <Stepper.Indicator />
            <Stepper.Title>Review</Stepper.Title>
          </Stepper.Trigger>
        </Stepper.Item>
      </Stepper.List>
      <Stepper.Content value="account">
        Enter your account details. This panel spans the full width of the horizontal stepper.
      </Stepper.Content>
      <Stepper.Content value="payment">
        Choose a payment method. The active step can contain forms, summaries, or other wide content
        without being constrained by the step label.
      </Stepper.Content>
      <Stepper.Content value="review">Review your order.</Stepper.Content>
      <Stepper.Actions>
        <Stepper.Previous />
        <Stepper.Next />
      </Stepper.Actions>
    </Stepper.Root>
  );
}

export const Horizontal: Story = {
  render: () => <CheckoutStepper />,
  play: async () => {
    const list = document.querySelector<HTMLElement>('[data-slot="stepper-list"]');
    const content = document.querySelector<HTMLElement>(
      '[data-slot="stepper-content"]:not([hidden])',
    );
    if (!list || !content)
      throw new Error("The horizontal Stepper did not render its active content.");

    const listRect = list.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const triggers = [...document.querySelectorAll<HTMLElement>('[data-slot="stepper-trigger"]')];
    expect(contentRect.left).toBeCloseTo(listRect.left, 0);
    expect(contentRect.right).toBeCloseTo(listRect.right, 0);
    expect(triggers).toHaveLength(3);
    for (const [index, trigger] of triggers.entries()) {
      const nextTrigger = triggers[index + 1];
      if (!nextTrigger) continue;
      expect(trigger.getBoundingClientRect().right).toBeLessThanOrEqual(
        nextTrigger.getBoundingClientRect().left + 1,
      );
    }
  },
  parameters: {
    docs: {
      source: { code: `<Stepper.Root value={step} onValueChange={setStep}>...</Stepper.Root>` },
    },
  },
};

export const Vertical: Story = {
  render: () => <CheckoutStepper orientation="vertical" />,
  play: async () => {
    const indicator = document.querySelector<HTMLElement>('[data-slot="stepper-indicator"]');
    const content = document.querySelector<HTMLElement>(
      '[data-slot="stepper-content"]:not([hidden])',
    );
    if (!indicator || !content)
      throw new Error("The vertical Stepper did not render its indicator and active content.");

    expect(content.getBoundingClientRect().left).toBeGreaterThan(
      indicator.getBoundingClientRect().right,
    );
  },
};

export const Numbered: Story = {
  render: () => <CheckoutStepper showNumbers />,
  play: async () => {
    const root = document.querySelector<HTMLElement>('[data-slot="stepper"]');
    const indicator = document.querySelector<HTMLElement>('[data-slot="stepper-indicator"]');
    if (!root || !indicator) throw new Error("The numbered Stepper did not render.");

    expect(root).toHaveAttribute("data-show-numbers");
    expect(getComputedStyle(indicator, "::before").content).toContain("counter(stepper)");
  },
};

export const LegacyContent: Story = {
  render: () => (
    <Stepper.Root defaultValue="account" aria-label="Legacy checkout progress">
      <Stepper.List>
        <Stepper.Item value="account">
          <Stepper.Trigger>
            <Stepper.Indicator />
            Account
          </Stepper.Trigger>
          <Stepper.Content>
            Account details using the deprecated nested composition.
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item value="payment">
          <Stepper.Trigger>
            <Stepper.Indicator />
            Payment
          </Stepper.Trigger>
          <Stepper.Content>
            Payment details using the deprecated nested composition.
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.List>
    </Stepper.Root>
  ),
  play: async () => {
    const content = document.querySelector<HTMLElement>(
      '[data-slot="stepper-content"][data-legacy-content]',
    );
    if (!content) throw new Error("The legacy Stepper content did not render.");
    expect(content).toHaveAttribute("data-value", "account");
  },
};

export const Linear: Story = {
  render: () => (
    <Stepper.Root defaultValue="account" linear aria-label="Linear progress">
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
        <Stepper.Item value="review">
          <Stepper.Trigger>
            <Stepper.Indicator />
            Review
          </Stepper.Trigger>
        </Stepper.Item>
      </Stepper.List>
      <Stepper.Next />
    </Stepper.Root>
  ),
};
