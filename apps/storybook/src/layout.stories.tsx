import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex, Grid, Stack, Text } from "jaci-ui";

const boxStyle = {
  border: "1px solid var(--jaci-colors-border-default)",
  borderRadius: "0.75rem",
  padding: "1rem",
};

const meta = {
  title: "Foundations/Layout",
  tags: ["autodocs"],
  component: Stack,
  parameters: { docs: { source: { code: `<Stack gap="md"><Text>Content</Text></Stack>` } } },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutPrimitives: Story = {
  render: () => (
    <Stack gap="lg">
      <Flex justify="between">
        <Text style={boxStyle}>Start</Text>
        <Text style={boxStyle}>End</Text>
      </Flex>
      <Grid columns={3} gap="md">
        <Text style={boxStyle}>One</Text>
        <Text style={boxStyle}>Two</Text>
        <Text style={boxStyle}>Three</Text>
      </Grid>
    </Stack>
  ),
};
