import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker, Stack, Text } from "jaci-ui";
import { expect } from "storybook/test";

const meta = {
  title: "Forms/ColorPicker",
  component: ColorPicker.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPicker.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function Picker({
  defaultOpen = false,
  showAlpha = false,
}: {
  defaultOpen?: boolean;
  showAlpha?: boolean;
}) {
  const [color, setColor] = useState(showAlpha ? "rgba(37, 99, 235, 0.75)" : "#2563eb");
  return (
    <Stack gap="sm">
      <ColorPicker.Root
        defaultOpen={defaultOpen}
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

function source({
  defaultOpen = false,
  showAlpha = false,
}: {
  defaultOpen?: boolean;
  showAlpha?: boolean;
}) {
  const initialColor = showAlpha ? "rgba(37, 99, 235, 0.75)" : "#2563eb";
  return `import { useState } from "react";
import { ColorPicker, Stack, Text } from "jaci-ui";

function Example() {
  const [color, setColor] = useState("${initialColor}");
  return (
    <Stack gap="sm">
      <ColorPicker.Root
        ${defaultOpen ? "defaultOpen\n        " : ""}format="${showAlpha ? "rgb" : "hex"}"
        onValueChange={setColor}
        ${showAlpha ? "showAlpha\n        " : ""}swatches={["#2563eb", "#16a34a", "#dc2626", "#f59e0b"]}
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
              ${showAlpha ? "<ColorPicker.Alpha />\n              " : ""}<ColorPicker.Swatches aria-label="Suggested colors" />
              <ColorPicker.Input />
              <ColorPicker.NativeInput />
            </ColorPicker.Popup>
          </ColorPicker.Positioner>
        </ColorPicker.Portal>
      </ColorPicker.Root>
      <Text size="sm" tone="muted">Current value: {color}</Text>
    </Stack>
  );
}`;
}

const hexSource = source({});
const alphaSource = source({ showAlpha: true });
const paletteSource = source({ defaultOpen: true });

export const Hex: Story = {
  render: () => <Picker />,
  parameters: { docs: { source: { code: hexSource, language: "tsx" } } },
  play: async () => {
    const hue = document.querySelector<HTMLInputElement>("[data-slot='color-picker-hue']");
    const nativeInput = document.querySelector<HTMLInputElement>(
      "[data-slot='color-picker-native-input']",
    );
    if (!hue || !nativeInput) throw new Error("The color controls did not render.");

    expect(hue.style.getPropertyValue("--jaci-color-picker-thumb-color")).toContain("hsl(");
    expect(nativeInput.getBoundingClientRect().width).toBeGreaterThan(0);
  },
};

export const WithAlpha: Story = {
  render: () => <Picker showAlpha />,
  parameters: { docs: { source: { code: alphaSource, language: "tsx" } } },
  play: async () => {
    const alpha = document.querySelector<HTMLInputElement>("[data-slot='color-picker-alpha']");
    if (!alpha) throw new Error("The alpha control did not render.");

    expect(alpha.style.getPropertyValue("--jaci-color-picker-alpha-color")).toContain("rgb(");
    expect(alpha.getBoundingClientRect().width).toBeGreaterThan(0);
  },
};

export const PaletteDrag: Story = {
  render: () => <Picker defaultOpen />,
  parameters: {
    docs: {
      description: {
        story: "Drag across the saturation/lightness palette. The ring marks the current color.",
      },
      source: { code: paletteSource, language: "tsx" },
    },
  },
};

export const OverlayBlur: Story = {
  render: () => (
    <div
      style={{
        background: "linear-gradient(135deg, #2563eb, #f59e0b)",
        minHeight: "16rem",
        padding: "3rem",
      }}
    >
      <Picker defaultOpen />
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "The open popup uses the same translucent blurred surface as Select." },
      source: {
        code: `import { useState } from "react";
import { ColorPicker, Stack, Text } from "jaci-ui";

function Example() {
  const [color, setColor] = useState("#2563eb");
  return (
    <div style={{ background: "linear-gradient(135deg, #2563eb, #f59e0b)", minHeight: "16rem", padding: "3rem" }}>
      <Stack gap="sm">
        <ColorPicker.Root defaultOpen format="hex" onValueChange={setColor} swatches={["#2563eb", "#16a34a", "#dc2626", "#f59e0b"]} value={color}>
          <ColorPicker.Label>Brand color</ColorPicker.Label>
          <ColorPicker.Control><ColorPicker.Trigger><ColorPicker.Preview /><ColorPicker.Value /></ColorPicker.Trigger></ColorPicker.Control>
          <ColorPicker.Portal><ColorPicker.Positioner sideOffset={8}><ColorPicker.Popup>
            <ColorPicker.Palette /><ColorPicker.Hue /><ColorPicker.Swatches aria-label="Suggested colors" /><ColorPicker.Input /><ColorPicker.NativeInput />
          </ColorPicker.Popup></ColorPicker.Positioner></ColorPicker.Portal>
        </ColorPicker.Root>
        <Text size="sm" tone="muted">Current value: {color}</Text>
      </Stack>
    </div>
  );
}`,
        language: "tsx",
      },
    },
  },
};
