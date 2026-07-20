import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "jaci-ui";

const meta = {
  title: "Navigation/Sidebar",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface SidebarExampleProps {
  autoFocusToggle?: boolean;
  defaultOpen?: boolean;
}

function SidebarExample({ autoFocusToggle = false, defaultOpen = true }: SidebarExampleProps) {
  return (
    <div style={{ height: "32rem", width: "20rem" }}>
      <Sidebar.Root defaultOpen={defaultOpen}>
        <Sidebar.Header>
          <Sidebar.Label>Jaci UI</Sidebar.Label>
        </Sidebar.Header>

        <Sidebar.Toggle autoFocus={autoFocusToggle} />

        <Sidebar.Content aria-label="Product navigation">
          <Sidebar.Item active href="#overview">
            <span aria-hidden="true">⌂</span>
            <Sidebar.Label>Overview</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="#projects">
            <span aria-hidden="true">□</span>
            <Sidebar.Label>Projects</Sidebar.Label>
          </Sidebar.Item>
          <Sidebar.Item href="#members">
            <span aria-hidden="true">○</span>
            <Sidebar.Label>Members</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Content>

        <Sidebar.Footer>
          <Sidebar.Item href="#settings">
            <span aria-hidden="true">⚙</span>
            <Sidebar.Label>Settings</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Footer>
      </Sidebar.Root>
    </div>
  );
}

export const Expanded: Story = {
  render: () => <SidebarExample />,
};

export const Collapsed: Story = {
  render: () => <SidebarExample defaultOpen={false} />,
};

export const FocusedToggle: Story = {
  render: () => <SidebarExample autoFocusToggle />,
};
