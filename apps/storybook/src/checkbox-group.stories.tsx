import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup, FieldError, Stack } from "jaci-ui";

const meta = {
  title: "Forms/CheckboxGroup",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup.Root defaultValue={["typescript"]} name="skills" onValueChange={() => undefined}>
      <CheckboxGroup.Label>Skills</CheckboxGroup.Label>
      <CheckboxGroup.Options>
        <CheckboxGroup.Option>
          <CheckboxGroup.Item value="typescript">
            <CheckboxGroup.Indicator />
          </CheckboxGroup.Item>
          TypeScript
        </CheckboxGroup.Option>
        <CheckboxGroup.Option>
          <CheckboxGroup.Item value="react">
            <CheckboxGroup.Indicator />
          </CheckboxGroup.Item>
          React
        </CheckboxGroup.Option>
        <CheckboxGroup.Option>
          <CheckboxGroup.Item disabled value="legacy">
            <CheckboxGroup.Indicator />
          </CheckboxGroup.Item>
          Legacy systems
        </CheckboxGroup.Option>
      </CheckboxGroup.Options>
      <FieldError>Select at least one skill.</FieldError>
    </CheckboxGroup.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledCheckboxGroup() {
    const [value, setValue] = useState(["email"]);

    return (
      <Stack gap="sm">
        <CheckboxGroup.Root name="notifications" onValueChange={setValue} value={value}>
          <CheckboxGroup.Label>Notifications</CheckboxGroup.Label>
          <CheckboxGroup.Options>
            <CheckboxGroup.Option>
              <CheckboxGroup.Item value="email">
                <CheckboxGroup.Indicator />
              </CheckboxGroup.Item>
              Email
            </CheckboxGroup.Option>
            <CheckboxGroup.Option>
              <CheckboxGroup.Item value="push">
                <CheckboxGroup.Indicator />
              </CheckboxGroup.Item>
              Push
            </CheckboxGroup.Option>
          </CheckboxGroup.Options>
        </CheckboxGroup.Root>
      </Stack>
    );
  },
};
