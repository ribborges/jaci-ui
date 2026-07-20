import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "jaci-ui";

const portraitImage = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#52525b"/><circle cx="48" cy="35" r="17" fill="#e4e4e7"/><path d="M16 96c4-21 17-33 32-33s28 12 32 33" fill="#e4e4e7"/></svg>',
)}`;

const meta = {
  title: "Data Display/Avatar",
  tags: ["autodocs"],
  component: Avatar.Root,
} satisfies Meta<typeof Avatar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageAndFallback: Story = {
  render: () => (
    <Avatar.Root aria-label="Richard Borges" size="xl">
      <Avatar.Fallback>RB</Avatar.Fallback>
      <Avatar.Image alt="Richard Borges" src={portraitImage} />
    </Avatar.Root>
  ),
};

export const ResponsiveSizes: Story = {
  render: () => (
    <div
      style={{
        alignItems: "center",
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(5rem, 1fr))",
      }}
    >
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} style={{ display: "grid", gap: "0.5rem", justifyItems: "center" }}>
          <Avatar.Root aria-label={`Avatar size ${size}`} size={size}>
            <Avatar.Fallback>{size}</Avatar.Fallback>
          </Avatar.Root>
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const FallbackState: Story = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: "1rem" }}>
      <Avatar.Root aria-label="Jaci UI" shape="rounded" size="lg">
        <Avatar.Fallback>JU</Avatar.Fallback>
      </Avatar.Root>
      <span>Use a fallback when no image is available.</span>
    </div>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div data-jaci-theme="dark" style={{ padding: "1.5rem" }}>
      <Avatar.Root aria-label="Jaci UI" size="xl">
        <Avatar.Fallback>JU</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};
