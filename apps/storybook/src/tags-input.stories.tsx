import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, TagsInput, Text } from "jaci-ui";

const suggestions = ["React", "TypeScript", "Panda CSS", "Storybook", "Accessibility"];

const meta = {
  title: "Forms/TagsInput",
  component: TagsInput,
  tags: ["autodocs"],
  args: {
    data: suggestions,
    label: "Technologies",
    placeholder: "Type a tag and press comma",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Entrada de tags com sugestões, remoção individual e suporte controlado para integração com formulários.",
      },
      source: {
        code: `<TagsInput data={["React", "TypeScript"]} label="Technologies" placeholder="Type a tag and press comma" />`,
      },
    },
  },
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInitialTags: Story = {
  args: {
    defaultTags: ["React", "TypeScript"],
  },
  render: (args) => (
    <Stack gap="sm" style={{ maxWidth: "32rem" }}>
      <TagsInput {...args} />
      <Text size="sm" tone="muted">
        Use the remove button on a tag to delete it.
      </Text>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    defaultTags: ["React", "Panda CSS"],
    disabled: true,
  },
};
