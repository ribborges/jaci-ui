import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Command, Dialog, Stack, Text } from "jaci-ui";

const meta = {
  title: "Navigation/Command",
  component: Command.Root,
  tags: ["autodocs", "test"],
} satisfies Meta<typeof Command.Root>;
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
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Command.Root>
  <Command.Input aria-label="Search commands" placeholder="Search commands..." />
  <Command.List aria-label="Commands">
    <Command.Empty>No commands found.</Command.Empty>
    <Command.Group heading="Actions">
      <Command.Item value="new-file" keywords={["create", "document"]} onSelect={handleSelect}>
        New file
      </Command.Item>
      <Command.Item value="open-file" keywords={["load"]} onSelect={handleSelect}>
        Open file
      </Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Navigation">
      <Command.Item value="settings" onSelect={handleSelect}>Settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>`,
      },
    },
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
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Command.Root loading>
  <Command.Input aria-label="Search commands" placeholder="Loading commands..." />
  <Command.List aria-label="Command status">
    <Command.Loading>Loading...</Command.Loading>
  </Command.List>
</Command.Root>`,
      },
    },
  },
};

export const DisabledAndDuplicateValues: Story = {
  render: () => (
    <Command.Root aria-label="Project commands">
      <Command.Input aria-label="Search projects" placeholder="Search projects" />
      <Command.List aria-label="Projects">
        <Command.Group heading="Projects">
          <Command.Item value="open" onSelect={() => undefined}>
            Open workspace
          </Command.Item>
          <Command.Item value="open" onSelect={() => undefined}>
            Open settings
          </Command.Item>
          <Command.Item value="archive" disabled>
            Archive workspace
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Empty after filtering">
          <Command.Item value="never-visible" keywords={["different"]}>
            This item is hidden for the current search.
          </Command.Item>
        </Command.Group>
        <Command.Empty>No matching projects.</Command.Empty>
      </Command.List>
    </Command.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Command.Root disabled={false} loopFocus>
  <Command.Input aria-label="Search projects" />
  <Command.List>
    <Command.Group heading="Projects">
      <Command.Item value="open" onSelect={handleSelect}>Open workspace</Command.Item>
      <Command.Item value="open" onSelect={handleSelect}>Open settings</Command.Item>
      <Command.Item value="archive" disabled>Archive workspace</Command.Item>
    </Command.Group>
    <Command.Empty>No matching projects.</Command.Empty>
  </Command.List>
</Command.Root>`,
      },
    },
  },
};

export const InDialog: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger>Open command dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="sm">
            <Dialog.Header>
              <Dialog.Title>Quick actions</Dialog.Title>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <Command.Root>
                <Command.Input aria-label="Search actions" placeholder="Search actions" />
                <Command.List>
                  <Command.Item value="create" onSelect={() => undefined}>
                    Create project
                  </Command.Item>
                  <Command.Item value="settings" onSelect={() => undefined}>
                    Open settings
                  </Command.Item>
                </Command.List>
              </Command.Root>
            </Dialog.Body>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Dialog.Root>
  <Dialog.Trigger>Open command dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Viewport>
      <Dialog.Popup>
        <Dialog.Title>Quick actions</Dialog.Title>
        <Command.Root>{/* compose the command menu here */}</Command.Root>
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>
</Dialog.Root>`,
      },
    },
  },
};

export const CompactDropdown: Story = {
  render: () => (
    <Command.Root mode="dropdown" aria-label="Quick actions">
      <Command.Input aria-label="Search commands" placeholder="Search commands..." />
      <Command.List>
        <Command.Item value="new" onSelect={() => undefined}>
          New document
        </Command.Item>
        <Command.Item value="open" onSelect={() => undefined}>
          Open project
        </Command.Item>
        <Command.Item value="settings" onSelect={() => undefined}>
          Open settings
        </Command.Item>
      </Command.List>
    </Command.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Command.Root mode="dropdown" aria-label="Quick actions">
  <Command.Input aria-label="Search commands" placeholder="Search commands..." />
  <Command.List>
    <Command.Item value="new" onSelect={handleSelect}>New document</Command.Item>
    <Command.Item value="open" onSelect={handleSelect}>Open project</Command.Item>
  </Command.List>
</Command.Root>`,
      },
    },
  },
};
