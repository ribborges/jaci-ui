import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RangeSlider, Stack, Text } from "jaci-ui";

const meta = { title: "Forms/RangeSlider", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function RangeDemo({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return (
    <RangeSlider.Root defaultValue={[20, 80]} max={100} min={0} orientation={orientation}>
      <Stack gap="sm" style={{ minWidth: orientation === "horizontal" ? "20rem" : undefined }}>
        <Stack direction="horizontal" justify="between" align="center">
          <RangeSlider.Label>Price range</RangeSlider.Label>
          <RangeSlider.Value />
        </Stack>
        <RangeSlider.Control>
          <RangeSlider.Track>
            <RangeSlider.Indicator />
            <RangeSlider.Thumb aria-label="Minimum price" index={0} />
            <RangeSlider.Thumb aria-label="Maximum price" index={1} />
          </RangeSlider.Track>
        </RangeSlider.Control>
      </Stack>
    </RangeSlider.Root>
  );
}

export const Default: Story = { render: () => <RangeDemo /> };
export const Vertical: Story = {
  render: () => (
    <div style={{ height: "16rem", width: "4rem" }}>
      <RangeDemo orientation="vertical" />
    </div>
  ),
};
export const Controlled: Story = {
  render: function ControlledRange() {
    const [value, setValue] = useState<readonly [number, number]>([30, 70]);
    return (
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <RangeSlider.Root value={value} onValueChange={setValue}>
          <RangeSlider.Control>
            <RangeSlider.Track>
              <RangeSlider.Indicator />
              <RangeSlider.Thumb aria-label="Minimum" index={0} />
              <RangeSlider.Thumb aria-label="Maximum" index={1} />
            </RangeSlider.Track>
          </RangeSlider.Control>
        </RangeSlider.Root>
        <Text size="sm" tone="muted">
          Selected range: {value[0]}–{value[1]}
        </Text>
      </Stack>
    );
  },
};
