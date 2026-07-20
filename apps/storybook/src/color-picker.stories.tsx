import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/ColorPicker",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Picker({ showAlpha = false }: { showAlpha?: boolean }) {
  const [color, setColor] = useState(showAlpha ? "rgba(37, 99, 235, 0.75)" : "#2563eb");
  return (
    <Stack gap="sm">
      <ColorPicker.Root
        format={showAlpha ? "rgb" : "hex"}
        onValueChange={setColor}
        showAlpha={showAlpha}
        swatches={["#2563eb", "#16a34a", "#dc2626", "#f59e0b"]}
        value={color}
      >
        <ColorPicker.Label>Brand color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Trigger>
            <ColorPicker.Preview />
            <ColorPicker.Value />
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        <ColorPicker.Portal>
          <ColorPicker.Positioner sideOffset={8}>
            <ColorPicker.Popup>
              <ColorPicker.Palette />
              <ColorPicker.Hue />
              {showAlpha ? <ColorPicker.Alpha /> : null}
              <ColorPicker.Swatches aria-label="Suggested colors" />
              <ColorPicker.Input />
              <ColorPicker.NativeInput />
            </ColorPicker.Popup>
          </ColorPicker.Positioner>
        </ColorPicker.Portal>
      </ColorPicker.Root>
      <Text size="sm" tone="muted">
        Current value: {color}
      </Text>
    </Stack>
  );
}

export const Hex: Story = { render: () => <Picker /> };
export const WithAlpha: Story = { render: () => <Picker showAlpha /> };
