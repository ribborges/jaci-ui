import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch, Stack, Text } from "jaci-ui";

const meta = {
  title: "Foundations/ColorSwatch",
  tags: ["autodocs"],
  component: ColorSwatch,
  args: {
    color: "var(--jaci-colors-accent-default)",
    label: "Accent color",
    size: "md",
    shape: "circle",
  },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Palette: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md">
      {(
        [
          ["Accent", "var(--jaci-colors-accent-default)"],
          ["Success", "var(--jaci-colors-success)"],
          ["Warning", "var(--jaci-colors-warning)"],
          ["Danger", "var(--jaci-colors-danger)"],
        ] as const
      ).map(([label, color]) => (
        <Stack align="center" gap="sm" key={label}>
          <ColorSwatch color={color} label={label} />
          <Text size="sm">{label}</Text>
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    docs: {
      source: { code: `<ColorSwatch color="var(--jaci-colors-accent-default)" label="Accent" />` },
    },
  },
};

export const ShapesAndSizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md">
      <ColorSwatch color="#2563eb" size="sm" shape="square" />
      <ColorSwatch color="#16a34a" size="md" shape="circle" />
      <ColorSwatch color="#dc2626" size="lg" shape="square" />
    </Stack>
  ),
};
