import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox, Stack, Text } from "jaci-ui";

const frameworks = ["React", "Remix", "Next.js", "Vite", "Astro"];

const meta = {
  title: "Forms/Combobox",
  tags: ["autodocs"],
  component: Combobox.Root,
  parameters: {
    docs: {
      source: {
        code: `<Combobox.Root items={["React", "Vite"]}><Combobox.Label>Framework</Combobox.Label><Combobox.InputGroup><Combobox.Input placeholder="Search" /><Combobox.Trigger aria-label="Open options"><Combobox.Icon /></Combobox.Trigger></Combobox.InputGroup><Combobox.Portal><Combobox.Positioner><Combobox.Popup><Combobox.List>{(item) => <Combobox.Item value={item}>{item}</Combobox.Item>}</Combobox.List></Combobox.Popup></Combobox.Positioner></Combobox.Portal></Combobox.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function FrameworkCombobox({ multiple = false }: { multiple?: boolean }) {
  return (
    <Combobox.Root
      items={frameworks}
      itemToStringLabel={(item) => item}
      multiple={multiple}
      name={multiple ? "frameworks" : "framework"}
    >
      <Combobox.Label>Framework</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Search frameworks…" />
        <Combobox.Clear />
        <Combobox.Trigger aria-label="Open framework options">
          <Combobox.Icon />
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner align="start" side="bottom" sideOffset={8}>
          <Combobox.Popup>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
                  {item}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              )}
            </Combobox.List>
            <Combobox.Empty>No framework found.</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
      <Combobox.Status aria-live="polite" />
    </Combobox.Root>
  );
}

export const Searchable: Story = {
  render: () => <FrameworkCombobox />,
};

export const Multiple: Story = {
  render: () => <FrameworkCombobox multiple />,
};

export const Loading: Story = {
  render: () => (
    <Combobox.Root items={[]} loading defaultOpen>
      <Combobox.Label>Framework</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Loading frameworks…" />
        <Combobox.Trigger aria-label="Open framework options">
          <Combobox.Icon />
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List />
            <Combobox.Loading>Loading frameworks…</Combobox.Loading>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledCombobox() {
    const [value, setValue] = useState<string | null>("React");

    return (
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <Combobox.Root
          items={frameworks}
          value={value}
          onValueChange={setValue}
          itemToStringLabel={(item) => item}
        >
          <Combobox.Label>Selected framework</Combobox.Label>
          <Combobox.InputGroup>
            <Combobox.Input aria-label="Selected framework" />
            <Combobox.Trigger aria-label="Open selected framework options">
              <Combobox.Icon />
            </Combobox.Trigger>
          </Combobox.InputGroup>
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  {(item: string) => (
                    <Combobox.Item key={item} value={item}>
                      {item}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
        <Text size="sm" tone="muted">
          Controlled value: {value ?? "none"}
        </Text>
      </Stack>
    );
  },
};
