import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Command, Stack, Text } from "jaci-ui";

const meta = { title: "Navigation/Command", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Search: Story = {
  render: function CommandStory() {
    const [selected, setSelected] = useState("Nothing selected");
    return (
      <Stack gap="sm">
        <Command.Root>
          <Command.Input aria-label="Search commands" placeholder="Search commands..." />
          <Command.List aria-label="Commands">
            <Command.Empty>No commands found.</Command.Empty>
            <Command.Group heading="Actions">
              <Command.Item
                value="new-file"
                keywords={["create", "document"]}
                onSelect={() => setSelected("New file")}
              >
                New file
              </Command.Item>
              <Command.Item
                value="open-file"
                keywords={["load"]}
                onSelect={() => setSelected("Open file")}
              >
                Open file
              </Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Navigation">
              <Command.Item value="settings" onSelect={() => setSelected("Settings")}>
                Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command.Root>
        <Text size="sm" tone="muted">
          {selected}
        </Text>
      </Stack>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <Command.Root loading>
      <Command.Input aria-label="Search commands" placeholder="Loading commands..." />
      <Command.List aria-label="Command status">
        <Command.Loading>Loading...</Command.Loading>
      </Command.List>
    </Command.Root>
  ),
};
