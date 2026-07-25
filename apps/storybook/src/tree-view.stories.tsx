import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TreeView, Text } from "jaci-ui";

const meta = {
  title: "Navigation/TreeView",
  component: TreeView.Root,
  tags: ["autodocs", "test"],
} satisfies Meta<typeof TreeView.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Files: Story = {
  render: function TreeStory() {
    const [selected, setSelected] = useState<string | readonly string[] | null>(null);
    return (
      <div style={{ maxWidth: "22rem" }}>
        <TreeView.Root
          defaultExpanded={["src"]}
          onSelectedChange={setSelected}
          aria-label="Project files"
        >
          <TreeView.Item id="src">
            <TreeView.Toggle aria-label="Toggle src" />
            <TreeView.Label>src</TreeView.Label>
            <TreeView.Group>
              <TreeView.Item id="components">
                <TreeView.Toggle aria-label="Toggle components" />
                <TreeView.Label>components</TreeView.Label>
                <TreeView.Group>
                  <TreeView.Item id="button">
                    <TreeView.Label>button.tsx</TreeView.Label>
                  </TreeView.Item>
                  <TreeView.Item id="dialog">
                    <TreeView.Label>dialog.tsx</TreeView.Label>
                  </TreeView.Item>
                </TreeView.Group>
              </TreeView.Item>
              <TreeView.Item id="index">
                <TreeView.Label>index.ts</TreeView.Label>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
          <TreeView.Item id="package" disabled>
            <TreeView.Label>package.json</TreeView.Label>
          </TreeView.Item>
        </TreeView.Root>
        <Text size="sm" tone="muted">
          Selected: {Array.isArray(selected) ? selected.join(", ") : (selected ?? "none")}
        </Text>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<TreeView.Root
  defaultExpanded={["src"]}
  selectionMode="single"
  onSelectedChange={setSelected}
  aria-label="Project files"
>
  <TreeView.Item id="src">
    <TreeView.Toggle aria-label="Toggle src" />
    <TreeView.Label>src</TreeView.Label>
    <TreeView.Group>
      <TreeView.Item id="components">
        <TreeView.Toggle aria-label="Toggle components" />
        <TreeView.Label>components</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item id="button">
            <TreeView.Label>button.tsx</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item id="dialog">
            <TreeView.Label>dialog.tsx</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
      <TreeView.Item id="index">
        <TreeView.Label>index.ts</TreeView.Label>
      </TreeView.Item>
    </TreeView.Group>
  </TreeView.Item>
</TreeView.Root>`,
      },
    },
  },
};

export const MultipleSelection: Story = {
  render: () => (
    <TreeView.Root selectionMode="multiple" defaultExpanded={["docs"]} aria-label="Documentation">
      <TreeView.Item id="docs">
        <TreeView.Toggle aria-label="Toggle docs" />
        <TreeView.Label>docs</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item id="intro">
            <TreeView.Label>introduction.md</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item id="api">
            <TreeView.Label>api.md</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
    </TreeView.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<TreeView.Root selectionMode="multiple" defaultExpanded={["docs"]} aria-label="Documentation">
  <TreeView.Item id="docs">
    <TreeView.Toggle aria-label="Toggle docs" />
    <TreeView.Label>docs</TreeView.Label>
    <TreeView.Group>
      <TreeView.Item id="intro">
        <TreeView.Label>introduction.md</TreeView.Label>
      </TreeView.Item>
      <TreeView.Item id="api">
        <TreeView.Label>api.md</TreeView.Label>
      </TreeView.Item>
    </TreeView.Group>
  </TreeView.Item>
</TreeView.Root>`,
      },
    },
  },
};

export const LazyLoading: Story = {
  render: () => (
    <TreeView.Root defaultExpanded={["packages"]} aria-label="Packages">
      <TreeView.Item id="packages" hasChildren loading>
        <TreeView.Toggle aria-label="Toggle packages" />
        <TreeView.Label>packages</TreeView.Label>
      </TreeView.Item>
      <TreeView.Loading>Loading package children…</TreeView.Loading>
    </TreeView.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<TreeView.Root defaultExpanded={["packages"]} aria-label="Packages">
  <TreeView.Item id="packages" hasChildren loading>
    <TreeView.Toggle aria-label="Toggle packages" />
    <TreeView.Label>packages</TreeView.Label>
  </TreeView.Item>
  <TreeView.Loading>Loading package children…</TreeView.Loading>
</TreeView.Root>`,
      },
    },
  },
};

export const EmptyAndError: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <TreeView.Root aria-label="Empty tree">
        <TreeView.Empty>No files in this folder.</TreeView.Empty>
      </TreeView.Root>
      <TreeView.Root aria-label="Failed tree">
        <TreeView.Error>Could not load this folder.</TreeView.Error>
      </TreeView.Root>
    </div>
  ),
};
