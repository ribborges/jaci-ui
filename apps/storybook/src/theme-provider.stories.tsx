import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ColorPicker,
  formatColor,
  Heading,
  Input,
  Link,
  parseColor,
  Stack,
  Text,
  ThemeProvider,
  useTheme,
} from "jaci-ui";

const meta = {
  title: "Foundations/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Provider opcional para controlar o modo claro/escuro e sobrescrever tokens semânticos em um escopo local.",
      },
      source: {
        code: `<ThemeProvider defaultTheme="system" ssrTheme="light">
  <App />
</ThemeProvider>`,
      },
    },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ThemeControls() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <Stack gap="sm">
      <Text>
        Mode: {theme} / resolved: {resolvedTheme}
      </Text>
      <Stack direction="horizontal" gap="sm">
        <Button onClick={() => setTheme("light")}>Light</Button>
        <Button onClick={() => setTheme("dark")}>Dark</Button>
        <Button onClick={() => setTheme("system")}>System</Button>
      </Stack>
    </Stack>
  );
}

export const Light: Story = {
  args: { defaultTheme: "light" },
  render: (args) => (
    <ThemeProvider {...args} style={{ padding: "1.5rem" }}>
      <ThemeControls />
    </ThemeProvider>
  ),
};

export const Dark: Story = {
  args: { defaultTheme: "dark" },
  render: (args) => (
    <ThemeProvider {...args} style={{ padding: "1.5rem" }}>
      <ThemeControls />
    </ThemeProvider>
  ),
};

export const SystemWithServerTheme: Story = {
  args: { defaultTheme: "system", ssrTheme: "dark" },
  render: (args) => (
    <ThemeProvider {...args} style={{ padding: "1.5rem" }}>
      <ThemeControls />
    </ThemeProvider>
  ),
};

export const Controlled: Story = {
  render: function ControlledTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    return (
      <ThemeProvider
        theme={theme}
        onThemeChange={(next) => setTheme(next === "dark" ? "dark" : "light")}
      >
        <ThemeControls />
      </ThemeProvider>
    );
  },
};

function hoverAccent(value: string) {
  const parsed = parseColor(value);
  if (!parsed) return value;

  const lightness = Math.min(
    100,
    Math.max(0, parsed.lightness + (parsed.lightness > 50 ? -10 : 10)),
  );
  return formatColor({ ...parsed, lightness }, "hex");
}

function accentForeground(value: string) {
  const parsed = parseColor(value);
  return parsed && parsed.lightness > 62 ? "#18181b" : "#ffffff";
}

function ScopedAccentPanel({ initialColor, name }: { initialColor: string; name: string }) {
  const [accent, setAccent] = useState(initialColor);
  const foreground = accentForeground(accent);

  return (
    <ThemeProvider
      defaultTheme="light"
      tokens={{
        colors: {
          accent: { default: accent, hover: hoverAccent(accent) },
          fg: { onAccent: foreground },
          focus: accent,
          selected: `${accent}22`,
        },
      }}
      style={{ flex: "1 1 20rem", minWidth: "min(100%, 20rem)", padding: "1rem" }}
    >
      <Stack gap="md">
        <Stack gap="none">
          <Heading as="h3" size="sm">
            {name} scope
          </Heading>
          <Text size="sm" tone="muted">
            Only this scope changes when you select a color.
          </Text>
        </Stack>

        <ColorPicker.Root
          format="hex"
          onValueChange={setAccent}
          swatches={["#7c3aed", "#0f766e", "#2563eb", "#c2410c", "#be123c"]}
          value={accent}
        >
          <ColorPicker.Label>Accent color</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Trigger aria-label={`Choose accent color for ${name}`}>
              <ColorPicker.Preview />
              <ColorPicker.Value />
            </ColorPicker.Trigger>
          </ColorPicker.Control>
          <ColorPicker.Portal>
            <ColorPicker.Positioner sideOffset={8}>
              <ColorPicker.Popup>
                <ColorPicker.Palette />
                <ColorPicker.Hue />
                <ColorPicker.Swatches aria-label={`${name} accent swatches`} />
                <ColorPicker.Input />
              </ColorPicker.Popup>
            </ColorPicker.Positioner>
          </ColorPicker.Portal>
        </ColorPicker.Root>

        <Card variant="subtle">
          <CardHeader>
            <CardTitle>Scoped components</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="sm">
              <Stack direction="horizontal" gap="sm" wrap="wrap">
                <Button variant="solid">Primary action</Button>
                <Button>Secondary</Button>
                <Badge tone="accent">Accent badge</Badge>
              </Stack>
              <Input aria-label={`${name} scoped input`} placeholder="Themed input" />
              <Link href="#scoped-accent">Themed link</Link>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}

export const ScopedAccent: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" wrap="wrap" id="scoped-accent">
      <ScopedAccentPanel initialColor="#7c3aed" name="Purple" />
      <ScopedAccentPanel initialColor="#0f766e" name="Teal" />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Each panel owns its accent tokens. Use the ColorPicker to change one scope and compare the independent buttons, badges, links, inputs and focus colors.",
      },
      source: {
        code: `function AccentScope() {
  const [accent, setAccent] = useState("#7c3aed");

  return (
    <ThemeProvider
      tokens={{
        colors: {
          accent: { default: accent, hover: hoverAccent(accent) },
          fg: { onAccent: "#ffffff" },
        },
      }}
    >
      <ColorPicker.Root value={accent} onValueChange={setAccent} format="hex">
        <ColorPicker.Label>Accent color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Trigger aria-label="Choose accent color">
            <ColorPicker.Preview />
            <ColorPicker.Value />
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        <ColorPicker.Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Popup>
              <ColorPicker.Palette />
              <ColorPicker.Hue />
            </ColorPicker.Popup>
          </ColorPicker.Positioner>
        </ColorPicker.Portal>
      </ColorPicker.Root>
      <Button variant="solid">Primary action</Button>
      <Badge tone="accent">Accent badge</Badge>
      <Input aria-label="Themed input" />
    </ThemeProvider>
  );
}`,
      },
    },
  },
};
