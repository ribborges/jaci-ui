import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress, Stack, Text } from "jaci-ui";

const meta = {
  title: "Feedback/Progress",
  tags: ["autodocs"],
  component: Progress,
  args: { value: 36, max: 100 },
  parameters: { docs: { source: { code: `<Progress value={72} max={100} label="Uploading" />` } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Values: Story = {
  render: () => (
    <Stack gap="lg" style={{ minWidth: "20rem" }}>
      <Progress label="Uploading design assets" value={36} />
      <Progress label="Release checklist" max={8} value={6} />
      <Progress aria-label="Syncing project data" indeterminate />
      <Text size="sm" tone="muted">
        An indeterminate progress bar omits its current value from the accessibility tree.
      </Text>
    </Stack>
  ),
};

export const WithValueText: Story = {
  render: () => (
    <Progress aria-valuetext="3 of 5 files uploaded" label="Uploading files" max={5} value={3} />
  ),
};

export const Localized: Story = {
  render: () => (
    <Progress
      format={{ maximumFractionDigits: 1, style: "percent" }}
      getAriaValueText={(formatted) => `${formatted} concluído`}
      label="Upload"
      locale="pt-BR"
      max={1}
      value={0.72}
      valueLabel="72%"
    />
  ),
};
