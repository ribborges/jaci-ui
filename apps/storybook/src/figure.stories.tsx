import type { Meta, StoryObj } from "@storybook/react-vite";
import { Figure } from "jaci-ui";

const source = "https://picsum.photos/seed/jaci-figure/1280/720";

const meta = {
  title: "Content/Figure",
  tags: ["autodocs"],
  component: Figure.Root,
  args: { lightbox: true },
} satisfies Meta<typeof Figure.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCaption: Story = {
  render: (args) => (
    <Figure.Root {...args} style={{ maxWidth: "36rem" }}>
      <Figure.Image
        alt="Mountain landscape from Lorem Picsum"
        height={720}
        src={source}
        width={1280}
      />
      <Figure.Caption>Mountain landscape captured for the Jaci UI gallery.</Figure.Caption>
    </Figure.Root>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Figure.Root lightbox>
  <Figure.Image
    src="https://picsum.photos/seed/jaci-figure/1280/720"
    alt="Mountain landscape"
  />
  <Figure.Caption>Mountain landscape captured for the gallery.</Figure.Caption>
</Figure.Root>`,
      },
    },
  },
};

export const Static: Story = {
  args: { lightbox: false },
  render: (args) => (
    <Figure.Root {...args} style={{ maxWidth: "24rem" }}>
      <Figure.Image alt="A colorful landscape" src={source} />
      <Figure.Caption>Lightbox disabled for this figure.</Figure.Caption>
    </Figure.Root>
  ),
};
