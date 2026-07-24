import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Field, FieldError, Select, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/Select",
  component: Select.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlanOptions() {
  return (
    <>
      <Select.Group>
        <Select.GroupLabel>Individual</Select.GroupLabel>
        <Select.Item value="starter">
          <Select.ItemText>Starter</Select.ItemText>
          <Select.ItemIndicator />
        </Select.Item>
        <Select.Item value="pro">
          <Select.ItemText>Pro</Select.ItemText>
          <Select.ItemIndicator />
        </Select.Item>
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.GroupLabel>Teams</Select.GroupLabel>
        <Select.Item value="team">
          <Select.ItemText>Team</Select.ItemText>
          <Select.ItemIndicator />
        </Select.Item>
        <Select.Item disabled value="enterprise">
          <Select.ItemText>Enterprise (contact us)</Select.ItemText>
          <Select.ItemIndicator />
        </Select.Item>
      </Select.Group>
    </>
  );
}

function PlanSelect({
  autoFocus = false,
  errorId,
  invalid = false,
}: {
  autoFocus?: boolean;
  errorId?: string;
  invalid?: boolean;
}) {
  return (
    <Select.Root defaultValue="pro">
      <Select.Label>Workspace plan</Select.Label>
      <Select.Trigger
        aria-describedby={errorId}
        aria-invalid={invalid || undefined}
        autoFocus={autoFocus}
      >
        <Select.Value placeholder="Choose a plan" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner align="start" side="bottom" sideOffset={8}>
          <Select.Popup>
            <Select.List>
              <PlanOptions />
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.5rem", minWidth: "20rem" }}>
      <PlanSelect />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState<string | null>("pro");

    return (
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Label>Workspace plan</Select.Label>
          <Select.Trigger>
            <Select.Value placeholder="Choose a plan" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner align="start" side="bottom" sideOffset={8}>
              <Select.Popup>
                <Select.List>
                  <PlanOptions />
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Text size="sm" tone="muted">
          Controlled value: {value ?? "none"}
        </Text>
      </Stack>
    );
  },
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The trigger starts focused. Press Enter or Space to open it, then use Arrow keys and type-ahead to choose an item.",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", minWidth: "20rem" }}>
      <PlanSelect autoFocus />
      <Text size="sm" tone="muted">
        Use Enter, Space, Arrow keys and type-ahead to navigate options.
      </Text>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field invalid style={{ minWidth: "20rem" }}>
      <PlanSelect errorId="workspace-plan-error" invalid />
      <FieldError id="workspace-plan-error">Choose a plan before continuing.</FieldError>
    </Field>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div
      data-jaci-theme="dark"
      style={{ display: "grid", gap: "0.5rem", minWidth: "20rem", padding: "1.5rem" }}
    >
      <PlanSelect />
    </div>
  ),
};

export const OverlayBlur: Story = {
  render: () => (
    <div
      style={{
        background: "linear-gradient(135deg, #16a34a, #7c3aed)",
        minHeight: "16rem",
        padding: "3rem",
      }}
    >
      <Select.Root defaultOpen defaultValue="pro">
        <Select.Label>Workspace plan</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Choose a plan" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner align="start" side="bottom" sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <PlanOptions />
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Select.Root defaultOpen defaultValue="pro">
  <Select.Trigger><Select.Value /><Select.Icon /></Select.Trigger>
  <Select.Portal><Select.Positioner><Select.Popup><Select.List>
    <Select.Item value="pro"><Select.ItemText>Pro</Select.ItemText></Select.Item>
  </Select.List></Select.Popup></Select.Positioner></Select.Portal>
</Select.Root>`,
        language: "tsx",
      },
    },
  },
};
