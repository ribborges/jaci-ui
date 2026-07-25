import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stepper } from "jaci-ui";

const meta = {
  title: "Navigation/Stepper",
  tags: ["autodocs", "test"],
  component: Stepper.Root,
} satisfies Meta<typeof Stepper.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function CheckoutStepper({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
}) {
  const [step, setStep] = useState("account");
  return (
    <Stepper.Root
      aria-label="Checkout progress"
      orientation={orientation}
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
          <Stepper.Content>Enter your account details.</Stepper.Content>
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
          <Stepper.Content>Choose a payment method.</Stepper.Content>
        </Stepper.Item>
        <Stepper.Item value="review" disabled>
          <Stepper.Trigger>
            <Stepper.Indicator />
            <Stepper.Title>Review</Stepper.Title>
          </Stepper.Trigger>
          <Stepper.Content>Review your order.</Stepper.Content>
        </Stepper.Item>
      </Stepper.List>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Stepper.Previous />
        <Stepper.Next />
      </div>
    </Stepper.Root>
  );
}

export const Horizontal: Story = {
  render: () => <CheckoutStepper />,
  parameters: {
    docs: {
      source: { code: `<Stepper.Root value={step} onValueChange={setStep}>...</Stepper.Root>` },
    },
  },
};

export const Vertical: Story = {
  render: () => <CheckoutStepper orientation="vertical" />,
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
