import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { Navbar, Text } from "jaci-ui";

type NavbarItemId = "overview" | "projects" | "account";

interface NavbarStoryArgs {
  activeItem: NavbarItemId;
  autoFocusToggle: boolean;
  defaultOpen: boolean;
  forceVisibleToggle: boolean;
  modal: boolean;
  open?: boolean;
}

const meta = {
  title: "Navigation/Navbar",
  component: Navbar.Root,
  tags: ["autodocs"],
  args: {
    activeItem: "overview",
    autoFocusToggle: false,
    defaultOpen: false,
    forceVisibleToggle: false,
    modal: true,
  },
  argTypes: {
    activeItem: {
      control: "select",
      description: "Marks the active navigation destination.",
      options: ["overview", "projects", "account"],
    },
    autoFocusToggle: {
      control: "boolean",
      description: "Moves focus to the menu trigger when the story mounts.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state for the non-controlled composition.",
    },
    forceVisibleToggle: {
      control: "boolean",
      description: "Shows the mobile trigger at every viewport size for testing.",
    },
    modal: {
      control: "boolean",
      description: "Controls whether the drawer traps focus and locks page scroll.",
    },
    open: {
      control: "boolean",
      description: "Open state used by the controlled story.",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A responsive navigation bar with a fixed blurred surface and an accessible mobile drawer.",
      },
    },
  },
} satisfies Meta<NavbarStoryArgs>;

export default meta;
type Story = StoryObj<NavbarStoryArgs>;

interface NavbarExampleProps extends Omit<NavbarStoryArgs, "open"> {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

function NavbarExample({
  activeItem,
  autoFocusToggle,
  defaultOpen,
  forceVisibleToggle,
  modal,
  onOpenChange,
  open,
}: NavbarExampleProps) {
  const rootProps =
    open === undefined
      ? { defaultOpen, modal }
      : {
          modal,
          onOpenChange,
          open,
        };

  return (
    <div style={{ minHeight: "28rem", padding: "6rem 2rem 2rem", width: "100%" }}>
      <Navbar.Root {...rootProps}>
        <Navbar.Bar aria-label="Product navigation">
          <Navbar.Start>
            <Navbar.Toggle
              autoFocus={autoFocusToggle}
              style={forceVisibleToggle ? { display: "inline-flex" } : undefined}
            />
            <Navbar.Item active={activeItem === "overview"} href="#overview">
              Overview
            </Navbar.Item>
            <Navbar.Item active={activeItem === "projects"} href="#projects">
              Projects
            </Navbar.Item>
          </Navbar.Start>
          <Navbar.Center>
            <strong>Jaci UI</strong>
          </Navbar.Center>
          <Navbar.End>
            <Navbar.Item active={activeItem === "account"} href="#account">
              Account
            </Navbar.Item>
          </Navbar.End>
        </Navbar.Bar>

        <Navbar.Drawer>
          <Navbar.Close />
          <Text size="lg" style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
            Navigate
          </Text>
          <Navbar.Item active={activeItem === "overview"} href="#overview">
            Overview
          </Navbar.Item>
          <Navbar.Item active={activeItem === "projects"} href="#projects">
            Projects
          </Navbar.Item>
          <Navbar.Item href="#members">Members</Navbar.Item>
          <Navbar.Item active={activeItem === "account"} href="#account">
            Account
          </Navbar.Item>
        </Navbar.Drawer>
      </Navbar.Root>

      <Text tone="muted">
        The fixed bar uses a translucent surface with blur. The menu button opens an accessible
        Dialog drawer on small screens.
      </Text>
    </div>
  );
}

const usageCode = `import { Navbar } from "jaci-ui";
import "jaci-ui/styles.css";

export function SiteNavbar() {
  return (
    <Navbar.Root defaultOpen={false} modal>
      <Navbar.Bar aria-label="Product navigation">
        <Navbar.Start>
          <Navbar.Toggle aria-label="Open navigation menu" />
          <Navbar.Item active href="/overview">Overview</Navbar.Item>
          <Navbar.Item href="/projects">Projects</Navbar.Item>
        </Navbar.Start>
        <Navbar.Center>Jaci UI</Navbar.Center>
        <Navbar.End>
          <Navbar.Item href="/account">Account</Navbar.Item>
        </Navbar.End>
      </Navbar.Bar>

      <Navbar.Drawer>
        <Navbar.Close />
        <Navbar.Item href="/overview">Overview</Navbar.Item>
        <Navbar.Item href="/projects">Projects</Navbar.Item>
      </Navbar.Drawer>
    </Navbar.Root>
  );
}`;

export const Desktop: Story = {
  render: (args) => <NavbarExample {...args} />,
  parameters: {
    docs: {
      source: {
        code: usageCode,
      },
    },
  },
};

export const MobileDrawer: Story = {
  args: {
    defaultOpen: true,
    forceVisibleToggle: true,
  },
  render: (args) => <NavbarExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The drawer starts open to show the complete mobile composition. Close it with Escape, the close button, or an outside click.",
      },
      source: {
        code: `import { Navbar } from "jaci-ui";
import "jaci-ui/styles.css";

export function MobileNavbar() {
  return (
    <Navbar.Root defaultOpen>
      <Navbar.Bar aria-label="Product navigation">
        <Navbar.Toggle />
      </Navbar.Bar>
      <Navbar.Drawer>
        <Navbar.Close />
        <Navbar.Item href="/overview">Overview</Navbar.Item>
        <Navbar.Item href="/projects">Projects</Navbar.Item>
      </Navbar.Drawer>
    </Navbar.Root>
  );
}`,
      },
    },
  },
};

export const FocusedToggle: Story = {
  args: {
    autoFocusToggle: true,
    forceVisibleToggle: true,
  },
  render: (args) => <NavbarExample {...args} />,
  parameters: {
    docs: {
      source: {
        code: `import { Navbar } from "jaci-ui";
import "jaci-ui/styles.css";

export function FocusedNavbar() {
  return (
    <Navbar.Root>
      <Navbar.Bar aria-label="Product navigation">
        <Navbar.Toggle autoFocus />
        <Navbar.Item active href="/overview">Overview</Navbar.Item>
      </Navbar.Bar>
      <Navbar.Drawer>
        <Navbar.Close />
      </Navbar.Drawer>
    </Navbar.Root>
  );
}`,
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    open: false,
  },
  render: function ControlledNavbar(args) {
    const [open, setOpen] = useState(args.open ?? false);

    useEffect(() => {
      setOpen(args.open ?? false);
    }, [args.open]);

    return <NavbarExample {...args} open={open} onOpenChange={setOpen} />;
  },
  parameters: {
    docs: {
      description: {
        story: "The drawer state is owned by the application and can be controlled externally.",
      },
      source: {
        code: `import { useState } from "react";
import { Navbar } from "jaci-ui";
import "jaci-ui/styles.css";

export function ControlledNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <Navbar.Root open={open} onOpenChange={setOpen}>
      <Navbar.Bar aria-label="Product navigation">
        <Navbar.Toggle />
      </Navbar.Bar>
      <Navbar.Drawer>
        <Navbar.Close />
        <Navbar.Item href="/overview">Overview</Navbar.Item>
      </Navbar.Drawer>
    </Navbar.Root>
  );
}`,
      },
    },
  },
};
