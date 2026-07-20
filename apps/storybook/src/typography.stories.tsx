import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Heading, Link, Paragraph, Stack, Text } from "jaci-ui";

const meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  component: Heading,
  args: {
    children: "A clear heading",
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingSizes: Story = {
  render: () => (
    <Stack gap="lg">
      <Heading as="h1" size="2xl">
        Display heading
      </Heading>
      <Heading as="h2" size="xl">
        Section heading
      </Heading>
      <Heading as="h3" size="md">
        Card heading
      </Heading>
    </Stack>
  ),
};

export const TextAndLinks: Story = {
  render: () => (
    <Stack>
      <Text>Readable default body text.</Text>
      <Text tone="muted">Supporting information uses the muted tone.</Text>
      <Paragraph>
        This paragraph keeps the justified, indented visual rhythm of the original Jaci component.
      </Paragraph>
      <Link href="https://github.com/ribborges/jaci">Read the project source</Link>
      <Link href="https://github.com/ribborges/jaci" subtle={false}>
        Prominent action link
      </Link>
      <Stack direction="horizontal" gap="sm">
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
      </Stack>
    </Stack>
  ),
};
