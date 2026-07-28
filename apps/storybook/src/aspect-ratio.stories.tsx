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
        <img
          alt="Landscape from Lorem Picsum"
          src="https://picsum.photos/seed/jaci-aspect-ratio/1280/720"
          style={{ objectFit: "cover" }}
        />
      </AspectRatio>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div style={{ maxWidth: "32rem", width: "100%" }}>
  <AspectRatio ratio={16 / 9}>
    <img src="https://picsum.photos/seed/jaci-aspect-ratio/1280/720" alt="Landscape" />
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
