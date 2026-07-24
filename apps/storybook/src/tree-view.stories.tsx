import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TreeView, Text } from "jaci-ui";

const meta = {
  title: "Navigation/TreeView",
  component: TreeView.Root,
  tags: ["autodocs"],
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
