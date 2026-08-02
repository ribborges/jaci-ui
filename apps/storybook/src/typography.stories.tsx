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
      <Text lineClamp={2} width="full" weight="semibold">
        Typography supports explicit weights, predictable widths and multiline truncation for dense
        interfaces.
      </Text>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Text lineClamp={2} width="full" weight="semibold">Responsive text</Text>`,
      },
    },
  },
};

export const BadgeVariants: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap="wrap">
      <Badge tone="accent" variant="solid">
        Solid
      </Badge>
      <Badge tone="accent" variant="soft">
        Soft
      </Badge>
      <Badge tone="accent" variant="outline">
        Outline
      </Badge>
    </Stack>
  ),
  parameters: {
    docs: {
      source: { code: `<Badge tone="accent" variant="soft">Soft</Badge>` },
    },
  },
};

export const BadgeCustomColors: Story = {
  name: "Badge custom colors",
  render: () => (
    <>
      <style>{`
        .badge-brand { background: #7c3aed; color: #ffffff; }
        .badge-cyan { background: #cffafe; color: #155e75; }
        .badge-coral { background: transparent; border: 1px solid #f97316; color: #c2410c; }
      `}</style>
      <Stack direction="horizontal" gap="sm" wrap="wrap">
        <Badge tone="custom" variant="solid" className="badge-brand">
          Brand
        </Badge>
        <Badge tone="custom" variant="soft" className="badge-cyan">
          Cyan
        </Badge>
        <Badge tone="custom" variant="outline" className="badge-coral">
          Coral
        </Badge>
      </Stack>
    </>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Badge tone="custom" variant="solid" className="badge-brand">
  Brand
</Badge>

/* .badge-brand { background: #7c3aed; color: #fff; } */`,
      },
    },
  },
};
