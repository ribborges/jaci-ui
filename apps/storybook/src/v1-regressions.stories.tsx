import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Card, Figure, Select, Stack, ThemeProvider } from "jaci-ui";

const previewSource =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%237c3aed'/%3E%3C/svg%3E";

const meta = {
  title: "Quality/1.0 regressions",
  tags: ["autodocs"],
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemedPopupAndBlur: Story = {
  render: () => (
    <ThemeProvider defaultTheme="dark" style={{ minHeight: "12rem", padding: "2rem" }}>
      <Select.Root defaultOpen defaultValue="pro">
        <Select.Label>Workspace plan</Select.Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List aria-label="Workspace plans">
                <Select.Item value="pro">
                  <Select.ItemText>Pro</Select.ItemText>
                </Select.Item>
                <Select.Item value="team">
                  <Select.ItemText>Team</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </ThemeProvider>
  ),
  play: async () => {
    const popup = document.body.querySelector<HTMLElement>('[data-slot="select-popup"]');
    if (!popup) throw new Error("The themed popup did not render.");

    await expect(popup).toBeVisible();
    const host = popup.closest<HTMLElement>('[data-jaci-theme-portal="true"]');
    expect(host?.dataset.jaciTheme).toBe("dark");
    const computed = getComputedStyle(popup);
    expect(
      computed.backdropFilter || computed.getPropertyValue("-webkit-backdrop-filter"),
    ).toContain("blur");
  },
  parameters: {
    // Base UI uses focus guards around portaled popups. Axe reports those
    // implementation details as aria-hidden-focus while the popup is open.
    a11y: {
      config: {
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
    docs: {
      source: {
        code: `<ThemeProvider defaultTheme="dark">
  <Select.Root defaultOpen defaultValue="pro">
    <Select.Trigger><Select.Value /><Select.Icon /></Select.Trigger>
    <Select.Portal><Select.Positioner><Select.Popup><Select.List>
      <Select.Item value="pro"><Select.ItemText>Pro</Select.ItemText></Select.Item>
    </Select.List></Select.Popup></Select.Positioner></Select.Portal>
  </Select.Root>
</ThemeProvider>`,
      },
    },
  },
};

export const DarkElevation: Story = {
  render: () => (
    <ThemeProvider defaultTheme="dark" style={{ padding: "2rem" }}>
      <Card variant="elevated" style={{ maxWidth: "24rem" }}>
        <Card.Header>
          <Card.Title>Elevated surface</Card.Title>
        </Card.Header>
        <Card.Content>Elevation remains visible in dark mode.</Card.Content>
      </Card>
    </ThemeProvider>
  ),
  play: async () => {
    const card = document.querySelector<HTMLElement>('[data-slot="card"]');
    if (!card) throw new Error("The elevated card did not render.");
    expect(getComputedStyle(card).boxShadow).not.toBe("none");
  },
  parameters: {
    docs: {
      source: {
        code: `<ThemeProvider defaultTheme="dark">
  <Card variant="elevated">Elevated surface</Card>
</ThemeProvider>`,
      },
    },
  },
};

export const LightboxViewport: Story = {
  render: () => (
    <Figure.Root defaultOpen lightbox style={{ maxWidth: "32rem" }}>
      <Figure.Image alt="Purple preview" height={360} src={previewSource} width={640} />
      <Figure.Caption>The caption stays separate from the expanded image.</Figure.Caption>
    </Figure.Root>
  ),
  play: async () => {
    const popup = document.body.querySelector<HTMLElement>('[data-slot="figure-lightbox-popup"]');
    const image = document.body.querySelector<HTMLElement>('[data-slot="figure-lightbox-image"]');
    if (!popup || !image) throw new Error("The Figure lightbox did not render.");

    await expect(popup).toBeVisible();
    expect(getComputedStyle(popup).overflow).toBe("hidden");
    expect(getComputedStyle(image).borderRadius).toBe("0px");
  },
  parameters: {
    docs: {
      source: {
        code: `<Figure.Root lightbox>
  <Figure.Image src="/preview.jpg" alt="Preview" />
  <Figure.Caption>Caption</Figure.Caption>
</Figure.Root>`,
      },
    },
  },
};
