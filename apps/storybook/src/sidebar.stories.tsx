import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Sidebar } from "jaci-ui";

const meta = {
  title: "Navigation/Sidebar",
  tags: ["autodocs"],
  component: Sidebar.Root,
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

export const MobileOverlay: Story = {
  render: function MobileOverlayStory() {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ minHeight: "24rem", width: "20rem" }}>
        <button type="button" onClick={() => setOpen(true)}>
          Open navigation
        </button>
        <Sidebar.Root
          aria-label="Mobile navigation"
          mode="overlay"
          open={open}
          onOpenChange={setOpen}
        >
          <Sidebar.Header>
            <Sidebar.Label>Jaci UI</Sidebar.Label>
          </Sidebar.Header>
          <Sidebar.Toggle />
          <Sidebar.Content>
            <Sidebar.Item active href="#overview">
              Overview
            </Sidebar.Item>
            <Sidebar.Item href="#projects">Projects</Sidebar.Item>
            <Sidebar.Item href="#settings">Settings</Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Root>
        <p>Open the overlay and press Escape or click outside to close it.</p>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `<button onClick={() => setOpen(true)}>Open navigation</button>\n<Sidebar.Root mode="overlay" open={open} onOpenChange={setOpen}>\n  <Sidebar.Toggle />\n  <Sidebar.Content>...</Sidebar.Content>\n</Sidebar.Root>`,
      },
    },
  },
};

export const ResponsiveClassName: Story = {
  render: () => (
    <div style={{ height: "24rem", width: "20rem" }}>
      <style>{`
        .jaci-story-sidebar-desktop { display: none; }
        @media (min-width: 768px) { .jaci-story-sidebar-desktop { display: flex; } }
      `}</style>
      <Sidebar.Root className="jaci-story-sidebar-desktop" aria-label="Desktop navigation">
        <Sidebar.Header>
          <Sidebar.Label>Desktop navigation</Sidebar.Label>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Item active href="#overview">
            <Sidebar.Label>Overview</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Root>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Sidebar.Root className="desktop-only" aria-label="Desktop navigation">
  <Sidebar.Content>...</Sidebar.Content>
</Sidebar.Root>`,
      },
    },
  },
};
