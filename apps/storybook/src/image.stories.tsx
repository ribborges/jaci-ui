import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image, Stack, Text } from "jaci-ui";

const imageSource = "https://picsum.photos/seed/jaci-ui/640/360";

const meta = {
  title: "Content/Image",
  tags: ["autodocs"],
  component: Image,
  args: {
    alt: "Random landscape from Lorem Picsum",
    decoding: "async",
    fit: "cover",
    height: 360,
    loading: "eager",
    src: imageSource,
    width: 640,
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  render: (args) => <Image {...args} style={{ height: "12rem", width: "20rem" }} />,
  parameters: {
    docs: {
      source: {
        code: `<Image
  src="https://picsum.photos/seed/jaci-ui/640/360"
  alt="Random landscape from Lorem Picsum"
  width={640}
  height={360}
  fit="cover"
/>`,
      },
    },
  },
};

export const ErrorFallback: Story = {
  args: { src: "/missing-image.png", fallback: <Text>Image unavailable</Text> },
  render: (args) => <Image {...args} style={{ height: "12rem", width: "20rem" }} />,
};

export const ObjectFit: Story = {
  render: (args) => (
    <Stack direction="horizontal" gap="md">
      {(["contain", "cover", "fill"] as const).map((fit) => (
        <Image key={fit} {...args} fit={fit} style={{ height: "8rem", width: "12rem" }} />
      ))}
    </Stack>
  ),
};

export const Lightbox: Story = {
  args: { lightbox: true },
  render: (args) => <Image {...args} style={{ height: "12rem", width: "20rem" }} />,
  parameters: {
    docs: {
      source: {
        code: `<Image
  src="https://picsum.photos/seed/jaci-ui/640/360"
  alt="Random landscape from Lorem Picsum"
  lightbox
/>`,
      },
    },
  },
};
