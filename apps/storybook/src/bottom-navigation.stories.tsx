import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNavigation, Text } from "jaci-ui";

const meta = {
  title: "Navigation/BottomNavigation",
  tags: ["autodocs"],
  component: BottomNavigation,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Floating: Story = {
  render: () => (
    <div
      style={{ minHeight: "24rem", paddingBottom: "6rem", position: "relative", width: "20rem" }}
    >
      <Text tone="muted">
        This lower navigation remains floating above page content, matching the original Bottombar
        treatment.
      </Text>
      <BottomNavigation aria-label="Mobile navigation">
        <BottomNavigation.Item active href="#home">
          <span aria-hidden="true">⌂</span>
          Home
        </BottomNavigation.Item>
        <BottomNavigation.Item href="#projects">
          <span aria-hidden="true">□</span>
          Projects
        </BottomNavigation.Item>
        <BottomNavigation.Item href="#settings">
          <span aria-hidden="true">⚙</span>
          Settings
        </BottomNavigation.Item>
      </BottomNavigation>
    </div>
  ),
};

export const ResponsiveClassName: Story = {
  render: () => (
    <div style={{ minHeight: "24rem", paddingBottom: "6rem", position: "relative" }}>
      <style>{`
        .jaci-story-bottom-mobile { display: none; }
        @media (max-width: 767px) { .jaci-story-bottom-mobile { display: flex; } }
      `}</style>
      <Text size="sm" tone="muted">
        The external class controls visibility while Jaci keeps the navigation layout.
      </Text>
      <BottomNavigation className="jaci-story-bottom-mobile" aria-label="Mobile navigation">
        <BottomNavigation.Item active href="#home">
          Home
        </BottomNavigation.Item>
        <BottomNavigation.Item href="#projects">Projects</BottomNavigation.Item>
      </BottomNavigation>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<BottomNavigation className="mobile-only" aria-label="Mobile navigation">
  <BottomNavigation.Item href="/">Home</BottomNavigation.Item>
</BottomNavigation>`,
      },
    },
  },
};
