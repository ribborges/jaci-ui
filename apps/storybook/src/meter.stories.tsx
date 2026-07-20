import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter, Stack } from "jaci-ui";

const meta = { title: "Feedback/Meter", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <Stack gap="md" style={{ minWidth: "20rem" }}>
      {(["neutral", "accent", "success", "warning", "danger"] as const).map((tone, index) => (
        <Meter.Root key={tone} tone={tone} value={35 + index * 12}>
          <Meter.Label>{tone}</Meter.Label>
          <Meter.Track>
            <Meter.Indicator />
          </Meter.Track>
          <Meter.Value />
        </Meter.Root>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack gap="md" style={{ minWidth: "20rem" }}>
      <Meter.Root size="sm" value={25} aria-label="Small meter">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root size="md" value={50} aria-label="Medium meter">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root size="lg" value={75} aria-label="Large meter">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </Stack>
  ),
};
