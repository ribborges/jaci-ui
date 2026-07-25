import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PinInput, Text } from "jaci-ui";

const meta = {
  title: "Forms/PinInput",
  component: PinInput.Root,
  args: { length: 6 },
  tags: ["autodocs"],
} satisfies Meta<typeof PinInput.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <PinInput.Root length={6} name="code">
      <PinInput.Label>Verification code</PinInput.Label>
      <PinInput.Control>
        <PinInput.Inputs />
      </PinInput.Control>
      <PinInput.Description>Enter the six digit code.</PinInput.Description>
    </PinInput.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<PinInput.Root length={6} name="code">\n  <PinInput.Label>Verification code</PinInput.Label>\n  <PinInput.Control><PinInput.Inputs /></PinInput.Control>\n</PinInput.Root>`,
      },
    },
  },
};

export const ControlledOtp: Story = {
  render: function ControlledPin() {
    const [value, setValue] = useState("");
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <PinInput.Root
          length={6}
          value={value}
          onValueChange={setValue}
          onComplete={(code) => console.log(code)}
          otp
          autoFocus
        >
          <PinInput.Label>One-time password</PinInput.Label>
          <PinInput.Control>
            <PinInput.Inputs />
          </PinInput.Control>
        </PinInput.Root>
        <Text size="sm">Value: {value || "empty"}</Text>
      </div>
    );
  },
};

export const Password: Story = {
  render: () => (
    <PinInput.Root length={4} type="password">
      <PinInput.Label>PIN</PinInput.Label>
      <PinInput.Control>
        <PinInput.Inputs />
      </PinInput.Control>
    </PinInput.Root>
  ),
};
