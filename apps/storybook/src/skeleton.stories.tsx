import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, Stack } from "jaci-ui";

const meta = {
  title: "Feedback/Skeleton",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Stack gap="lg" style={{ minWidth: "20rem" }}>
      <Skeleton variant="text" style={{ width: "66%" }} />
      <Skeleton variant="text" />
      <Skeleton variant="circle" />
      <Skeleton variant="rect" style={{ height: "10rem" }} />
    </Stack>
  ),
};

export const Static: Story = {
  render: () => <Skeleton animated={false} style={{ height: "8rem", width: "20rem" }} />,
};
