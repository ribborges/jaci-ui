import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tooltip } from "jaci-ui";

const meta = {
  title: "Overlays/Tooltip",
  tags: ["autodocs"],
  component: Tooltip.Root,
  parameters: {
    docs: {
      source: {
        code: `<Tooltip.Root><Tooltip.Trigger>Hover me</Tooltip.Trigger><Tooltip.Portal><Tooltip.Positioner><Tooltip.Popup>Help</Tooltip.Popup></Tooltip.Positioner></Tooltip.Portal></Tooltip.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function TooltipContent() {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner side="top" sideOffset={8}>
        <Tooltip.Popup>
          Copies the installation command
          <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
}

export const Default: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover or focus me</Tooltip.Trigger>
      <TooltipContent />
    </Tooltip.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledTooltip() {
    const [open, setOpen] = useState(true);

    return (
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger onClick={() => setOpen((current) => !current)}>
          {open ? "Hide help" : "Show help"}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" sideOffset={8}>
            <Tooltip.Popup>
              This state is controlled by the host application.
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  },
};

export const KeyboardFocus: Story = {
  render: () => (
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger autoFocus>Focused trigger</Tooltip.Trigger>
      <TooltipContent />
    </Tooltip.Root>
  ),
};

export const DarkTheme: Story = {
  render: function ThemedTooltip() {
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

    return (
      <div
        ref={setPortalContainer}
        data-jaci-theme="dark"
        style={{ minHeight: "10rem", padding: "2rem" }}
      >
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Dark theme tooltip</Tooltip.Trigger>
          <Tooltip.Portal container={portalContainer}>
            <Tooltip.Positioner side="top" sideOffset={8}>
              <Tooltip.Popup>
                The portal inherits the local dark theme.
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    );
  },
};
