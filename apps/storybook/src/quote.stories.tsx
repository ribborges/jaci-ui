import type { Meta, StoryObj } from "@storybook/react-vite";
import { Quote, Stack } from "jaci-ui";

const meta = {
  title: "Content/Quote",
  tags: ["autodocs"],
  component: Quote,
  args: {
    children: "The best way to predict the future is to invent it.",
    variant: "default",
    size: "md",
  },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Quote>The best way to predict the future is to invent it.</Quote>`,
      },
    },
  },
};

export const Attributed: Story = {
  args: {
    author: "Alan Kay",
    cite: "https://en.wikipedia.org/wiki/Alan_Kay",
    source: "Alan Kay",
  },
  parameters: {
    docs: {
      source: {
        code: `<Quote
  author="Alan Kay"
  cite="https://en.wikipedia.org/wiki/Alan_Kay"
  source="Alan Kay"
>
  The best way to predict the future is to invent it.
</Quote>`,
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <Stack style={{ maxWidth: "42rem" }}>
      <Quote variant="default" size="sm">
        A neutral quote for supporting content.
      </Quote>
      <Quote variant="accent" size="md">
        An accent quote for emphasis.
      </Quote>
      <Quote variant="subtle" size="lg">
        A larger quote with a subtle surface.
      </Quote>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Stack style={{ maxWidth: "42rem" }}>
  <Quote variant="default" size="sm">A neutral quote for supporting content.</Quote>
  <Quote variant="accent" size="md">An accent quote for emphasis.</Quote>
  <Quote variant="subtle" size="lg">A larger quote with a subtle surface.</Quote>
</Stack>`,
      },
    },
  },
};
