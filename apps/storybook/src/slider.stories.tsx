import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Slider, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/Slider",
  tags: ["autodocs"],
  component: Slider.Root,
  parameters: {
    docs: {
      source: {
        code: `<Slider.Root defaultValue={42} min={0} max={100}><Slider.Label>Volume</Slider.Label><Slider.Control><Slider.Track><Slider.Indicator /><Slider.Thumb aria-label="Volume" /></Slider.Track></Slider.Control></Slider.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SliderDemo({
  defaultValue = 42,
  size,
}: {
  defaultValue?: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Slider.Root
      defaultValue={defaultValue}
      max={100}
      min={0}
      name="volume"
      {...(size === undefined ? {} : { size })}
    >
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <Stack direction="horizontal" justify="between" align="center">
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
        </Stack>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Volume" />
          </Slider.Track>
        </Slider.Control>
      </Stack>
    </Slider.Root>
  );
}

export const Default: Story = {
  render: () => <SliderDemo />,
};

export const Range: Story = {
  render: () => (
    <Slider.Root defaultValue={[20, 80]} max={100} min={0} name="price">
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <Stack direction="horizontal" justify="between" align="center">
          <Slider.Label>Price range</Slider.Label>
          <Slider.Value />
        </Stack>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Minimum price" index={0} />
            <Slider.Thumb aria-label="Maximum price" index={1} />
          </Slider.Track>
        </Slider.Control>
      </Stack>
    </Slider.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledSlider() {
    const [value, setValue] = useState(64);

    return (
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <Slider.Root value={value} max={100} min={0} onValueChange={setValue}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="Controlled volume" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <Text size="sm" tone="muted">
          Current value: {value}
        </Text>
      </Stack>
    );
  },
};
