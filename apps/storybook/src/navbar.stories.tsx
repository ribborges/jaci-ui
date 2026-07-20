import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar, Text } from "jaci-ui";

const meta = {
  title: "Navigation/Navbar",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface NavbarExampleProps {
  autoFocusToggle?: boolean;
  defaultOpen?: boolean;
  forceVisibleToggle?: boolean;
}

function NavbarExample({
  autoFocusToggle = false,
  defaultOpen = false,
  forceVisibleToggle = false,
}: NavbarExampleProps) {
  return (
    <div style={{ minHeight: "28rem", paddingTop: "6rem", width: "min(64rem, 100vw)" }}>
      <Navbar.Root defaultOpen={defaultOpen}>
        <Navbar.Bar aria-label="Product navigation">
          <Navbar.Start>
            <Navbar.Toggle
              autoFocus={autoFocusToggle}
              style={forceVisibleToggle ? { display: "inline-flex" } : undefined}
            />
            <Navbar.Item active href="#overview">
              Overview
            </Navbar.Item>
            <Navbar.Item href="#projects">Projects</Navbar.Item>
          </Navbar.Start>
          <Navbar.Center>
            <strong>Jaci UI</strong>
          </Navbar.Center>
          <Navbar.End>
            <Navbar.Item href="#account">Account</Navbar.Item>
          </Navbar.End>
        </Navbar.Bar>

        <Navbar.Drawer>
          <Navbar.Close />
          <Text size="lg" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
            Navigate
          </Text>
          <Navbar.Item active href="#overview">
            Overview
          </Navbar.Item>
          <Navbar.Item href="#projects">Projects</Navbar.Item>
          <Navbar.Item href="#members">Members</Navbar.Item>
          <Navbar.Item href="#settings">Settings</Navbar.Item>
        </Navbar.Drawer>
      </Navbar.Root>

      <Text tone="muted">
        The fixed bar uses its legacy-inspired blurred zinc surface. The menu button opens an
        accessible Dialog drawer on small screens.
      </Text>
    </div>
  );
}

export const Desktop: Story = {
  render: () => <NavbarExample />,
};

export const MobileDrawer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The drawer is open to show its mobile composition, including close control and links.",
      },
    },
  },
  render: () => <NavbarExample defaultOpen />,
};

export const FocusedToggle: Story = {
  render: () => <NavbarExample autoFocusToggle forceVisibleToggle />,
};
