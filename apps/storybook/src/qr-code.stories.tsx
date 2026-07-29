import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, QRCode, Stack, Text } from "jaci-ui";

const meta = {
  title: "Content/QRCode",
  tags: ["autodocs"],
  component: QRCode,
  args: {
    errorCorrectionLevel: "Q",
    label: "Example website",
    margin: 2,
    size: 220,
    value: "https://example.com",
  },
} satisfies Meta<typeof QRCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<QRCode value="https://example.com" size={220} errorCorrectionLevel="Q" label="Example website" />`,
      },
    },
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "https://example.com");
    return (
      <Stack align="start" gap="md">
        <Input
          aria-label="QR code value"
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
        <QRCode {...args} label="Generated QR code" value={value} />
        <Text size="sm">The SVG updates as you type.</Text>
      </Stack>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const [value, setValue] = useState("https://example.com");
<Input value={value} onChange={(event) => setValue(event.target.value)} />
<QRCode value={value} label="Generated QR code" />`,
      },
    },
  },
};

export const LongValue: Story = {
  args: {
    value:
      "https://example.com/docs/components/qrcode?theme=dark&format=svg&errorCorrectionLevel=Q",
  },
};

export const InvalidFallback: Story = {
  args: { fallback: <Text>Value is too long to encode.</Text>, value: "x".repeat(5000) },
};
