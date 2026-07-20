import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNavigation, Text } from "jaci-ui";

const meta = {
  title: "Navigation/BottomNavigation",
  tags: ["autodocs"],
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
