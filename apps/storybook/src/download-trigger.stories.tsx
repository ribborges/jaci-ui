import type { Meta, StoryObj } from "@storybook/react-vite";
import { DownloadTrigger, Stack, Text } from "jaci-ui";

const textFile = "data:text/plain;charset=utf-8,Jaci%20UI%20download";
const meta = {
  title: "Actions/DownloadTrigger",
  tags: ["autodocs"],
  component: DownloadTrigger,
  args: {
    children: "Download file",
    download: "jaci-ui.txt",
    href: textFile,
    size: "md",
    variant: "outline",
  },
} satisfies Meta<typeof DownloadTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<DownloadTrigger href="/files/report.pdf" download="report.pdf">Download report</DownloadTrigger>`,
      },
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="sm">
      <DownloadTrigger {...args} variant="solid">
        Solid
      </DownloadTrigger>
      <DownloadTrigger {...args} variant="outline">
        Outline
      </DownloadTrigger>
      <DownloadTrigger {...args} variant="ghost">
        Ghost
      </DownloadTrigger>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Stack gap="sm">
      <DownloadTrigger {...args} />
      <Text size="sm">Disabled links remain out of the tab order.</Text>
    </Stack>
  ),
};
