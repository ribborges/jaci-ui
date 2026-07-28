import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "jaci-ui";

const meta = {
  title: "Content/AspectRatio",
  tags: ["autodocs"],
  component: AspectRatio,
  args: { ratio: 16 / 9 },
  // The global Storybook preview uses a centered flex canvas. Keep this
  // story padded so the ratio box receives a definite inline size.
  parameters: { layout: "padded" },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Landscape: Story = {
  render: (args) => (
    <div style={{ maxWidth: "32rem", width: "100%" }}>
      <AspectRatio
        {...args}
        style={{
          border: "4px solid var(--jaci-colors-accent-default)",
          borderRadius: "var(--jaci-radii-xl)",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "var(--jaci-colors-accent-default)",
            color: "var(--jaci-colors-fg-on-accent)",
            display: "flex",
            fontSize: "1.25rem",
            fontWeight: 700,
            justifyContent: "center",
          }}
        >
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div style={{ maxWidth: "32rem", width: "100%" }}>
  <AspectRatio ratio={16 / 9}>
    <div style={{ background: "var(--jaci-colors-accent-default)" }}>16:9</div>
  </AspectRatio>
</div>`,
      },
    },
  },
};

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <div style={{ maxWidth: "16rem", width: "100%" }}>
      <AspectRatio
        {...args}
        style={{
          background: "var(--jaci-colors-surface-subtle)",
          border: "4px solid var(--jaci-colors-accent-default)",
          borderRadius: "var(--jaci-radii-xl)",
          color: "var(--jaci-colors-fg-muted)",
          display: "grid",
          placeItems: "center",
          width: "100%",
        }}
      >
        <span style={{ display: "grid", placeItems: "center" }}>1:1</span>
      </AspectRatio>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div style={{ maxWidth: "16rem", width: "100%" }}>
  <AspectRatio ratio={1}>
    <div>1:1</div>
  </AspectRatio>
</div>`,
      },
    },
  },
};

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => (
    <div style={{ maxWidth: "14rem", width: "100%" }}>
      <AspectRatio
        {...args}
        style={{
          background: "var(--jaci-colors-surface-subtle)",
          border: "4px solid var(--jaci-colors-accent-default)",
          borderRadius: "var(--jaci-radii-xl)",
          color: "var(--jaci-colors-fg-default)",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", justifyContent: "center" }}>3:4</div>
      </AspectRatio>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<AspectRatio ratio={3 / 4}>
  <div>3:4</div>
</AspectRatio>`,
      },
    },
  },
};
