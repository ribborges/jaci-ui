import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/ColorPicker",
  component: ColorPicker.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPicker.Root>;

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

const hexSource = `import { useState } from "react";
import { ColorPicker } from "jaci-ui";

const [color, setColor] = useState("#2563eb");

<ColorPicker.Root
  format="hex"
  value={color}
  onValueChange={setColor}
  swatches={["#2563eb", "#16a34a", "#dc2626", "#f59e0b"]}
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
        <ColorPicker.Swatches aria-label="Suggested colors" />
        <ColorPicker.Input />
        <ColorPicker.NativeInput />
      </ColorPicker.Popup>
    </ColorPicker.Positioner>
  </ColorPicker.Portal>
</ColorPicker.Root>`;

const alphaSource = hexSource
  .replace('format="hex"', 'format="rgb"\n  showAlpha')
  .replace('useState("#2563eb")', 'useState("rgba(37, 99, 235, 0.75)")')
  .replace(
    "        <ColorPicker.Swatches",
    "        <ColorPicker.Alpha />\n        <ColorPicker.Swatches",
  );

export const Hex: Story = {
  render: () => <Picker />,
  parameters: { docs: { source: { code: hexSource, language: "tsx" } } },
};

export const WithAlpha: Story = {
  render: () => <Picker showAlpha />,
  parameters: { docs: { source: { code: alphaSource, language: "tsx" } } },
};
