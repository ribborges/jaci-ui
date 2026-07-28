import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, Button, Stack } from "jaci-ui";

const meta = {
  title: "Feedback/Alert",
  tags: ["autodocs"],
  component: Alert.Root,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack gap="md" style={{ maxWidth: "36rem" }}>
      <Alert.Root tone="info">
        <Alert.Icon />
        <Alert.Title>New workspace settings are available</Alert.Title>
        <Alert.Description>
          Review the updated defaults before inviting your team.
        </Alert.Description>
      </Alert.Root>
      <Alert.Root tone="success">
        <Alert.Icon />
        <Alert.Title>Changes saved</Alert.Title>
        <Alert.Description>Your project is now ready for collaborators.</Alert.Description>
      </Alert.Root>
      <Alert.Root tone="warning">
        <Alert.Icon />
        <Alert.Title>Billing details need attention</Alert.Title>
        <Alert.Description>Update the payment method before the next renewal.</Alert.Description>
      </Alert.Root>
      <Alert.Root tone="danger">
        <Alert.Icon />
        <Alert.Title>Could not publish the release</Alert.Title>
        <Alert.Description>Check the validation errors and try again.</Alert.Description>
      </Alert.Root>
    </Stack>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <Alert.Root tone="info" style={{ maxWidth: "36rem" }}>
      <Alert.Icon>↗</Alert.Icon>
      <Alert.Title>Migration guide</Alert.Title>
      <Alert.Description>
        This alert keeps custom decorative icons hidden from assistive technology.
      </Alert.Description>
    </Alert.Root>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Alert.Root tone="warning" style={{ maxWidth: "36rem" }}>
      <Alert.Icon />
      <Alert.Title>Billing details need attention</Alert.Title>
      <Alert.Description>Update the payment method before the next renewal.</Alert.Description>
      <Alert.Actions>
        <Button size="sm">Review billing</Button>
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
      </Alert.Actions>
    </Alert.Root>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Alert.Root tone="warning">
  <Alert.Icon />
  <Alert.Title>Billing details need attention</Alert.Title>
  <Alert.Description>Update the payment method.</Alert.Description>
  <Alert.Actions><Button size="sm">Review billing</Button></Alert.Actions>
</Alert.Root>`,
      },
    },
  },
};
