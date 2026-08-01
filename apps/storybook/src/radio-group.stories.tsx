import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldError, RadioGroup, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/RadioGroup",
  tags: ["autodocs"],
  component: RadioGroup.Root,
  parameters: {
    docs: {
      source: {
        code: `<RadioGroup.Root defaultValue="pro"><RadioGroup.Label>Plan</RadioGroup.Label><RadioGroup.Options><RadioGroup.Option><RadioGroup.Item value="pro"><RadioGroup.Indicator /></RadioGroup.Item>Pro</RadioGroup.Option></RadioGroup.Options></RadioGroup.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup.Root
      defaultValue="pro"
      name="workspace-plan"
      required
      style={{ minWidth: "18rem" }}
    >
      <RadioGroup.Label>Workspace plan</RadioGroup.Label>
      <RadioGroup.Options>
        <RadioGroup.Option>
          <RadioGroup.Item value="starter">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          Starter
        </RadioGroup.Option>
        <RadioGroup.Option>
          <RadioGroup.Item value="pro">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          Pro
        </RadioGroup.Option>
        <RadioGroup.Option aria-disabled="true">
          <RadioGroup.Item disabled value="enterprise">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          Enterprise
        </RadioGroup.Option>
      </RadioGroup.Options>
      <FieldError>Choose a workspace plan.</FieldError>
    </RadioGroup.Root>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Stack gap="sm" style={{ minWidth: "20rem" }}>
      <RadioGroup.Root defaultValue="team" name="billing-plan">
        <RadioGroup.Label>Billing</RadioGroup.Label>
        <RadioGroup.Options>
          <RadioGroup.Option>
            <RadioGroup.Item value="individual">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <span>
              <strong>Individual</strong>
              <br />
              <Text as="span" size="sm" tone="muted">
                For personal workspaces.
              </Text>
            </span>
          </RadioGroup.Option>
          <RadioGroup.Option>
            <RadioGroup.Item value="team">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <span>
              <strong>Team</strong>
              <br />
              <Text as="span" size="sm" tone="muted">
                For shared projects.
              </Text>
            </span>
          </RadioGroup.Option>
        </RadioGroup.Options>
      </RadioGroup.Root>
    </Stack>
  ),
};
