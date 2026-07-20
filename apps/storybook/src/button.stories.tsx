import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stack } from "jaci-ui";

const meta = {
  title: "Actions/Button",
  tags: ["autodocs"],
  component: Button,
  args: {
    children: "Continue",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "solid", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md">
      <Button variant="outline">Outline</Button>
      <Button variant="solid">Solid</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
    </Stack>
  ),
};
