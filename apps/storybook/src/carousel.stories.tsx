import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect } from "storybook/test";
import { Carousel, Image, Stack, Text } from "jaci-ui";

const slides = [
  {
    title: "Mountains",
    description: "A quiet landscape for the weekend.",
    src: "https://picsum.photos/seed/jaci-carousel-1/960/540",
  },
  {
    title: "Coastline",
    description: "A bright view from the Jaci gallery.",
    src: "https://picsum.photos/seed/jaci-carousel-2/960/540",
  },
  {
    title: "Forest",
    description: "A calm green space to explore.",
    src: "https://picsum.photos/seed/jaci-carousel-3/960/540",
  },
];

const meta = {
  title: "Media/Carousel",
  tags: ["autodocs"],
  component: Carousel.Root,
  args: { loop: true, orientation: "horizontal", swipeable: true },
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function Gallery(props: ComponentProps<typeof Carousel.Root>) {
  return (
    <Carousel.Root {...props} style={{ maxWidth: "42rem" }} aria-label="Featured images">
      <Carousel.Viewport>
        <Carousel.Track>
          {slides.map((slide, index) => (
            <Carousel.Item index={index} key={slide.title}>
              <Carousel.Media>
                <Image
                  alt={slide.title}
                  height={540}
                  lightbox={false}
                  src={slide.src}
                  width={960}
                />
              </Carousel.Media>
              <Carousel.Caption>
                <Carousel.Title>{slide.title}</Carousel.Title>
                <Carousel.Description>{slide.description}</Carousel.Description>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel.Track>
      </Carousel.Viewport>
      <Carousel.Previous />
      <Carousel.Next />
      <Carousel.Indicators />
    </Carousel.Root>
  );
}

export const GalleryStory: Story = {
  render: (args) => <Gallery {...args} />,
  play: async () => {
    const previous = document.querySelector<HTMLElement>('[data-slot="carousel-previous"]');
    const next = document.querySelector<HTMLElement>('[data-slot="carousel-next"]');
    if (!previous || !next) throw new Error("Carousel arrow controls were not rendered.");

    const previousRect = previous.getBoundingClientRect();
    const nextRect = next.getBoundingClientRect();
    expect(previousRect.width).toBeGreaterThan(0);
    expect(nextRect.width).toBeGreaterThan(0);
    expect(previousRect.right).toBeLessThan(nextRect.left);
  },
  parameters: {
    docs: {
      source: {
        code: `<Carousel.Root aria-label="Featured images" loop>
  <Carousel.Viewport>
    <Carousel.Track>
      <Carousel.Item index={0}>
        <Carousel.Media><Image src="/project.jpg" alt="Project preview" /></Carousel.Media>
        <Carousel.Caption>
          <Carousel.Title>Project title</Carousel.Title>
          <Carousel.Description>Project description</Carousel.Description>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel.Root>`,
      },
    },
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [index, setIndex] = useState(0);
    return (
      <Stack gap="sm">
        <Gallery {...args} index={index} onIndexChange={setIndex} />
        <Text style={{ textAlign: "center" }}>
          Slide {index + 1} of {slides.length}
        </Text>
      </Stack>
    );
  },
};

export const Autoplay: Story = {
  args: { autoplay: true, autoplayInterval: 2200, pauseOnFocus: true, pauseOnHover: true },
  render: (args) => <Gallery {...args} />,
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={{ height: "28rem", maxWidth: "28rem" }}>
      <Gallery {...args} />
    </div>
  ),
  play: async () => {
    const root = document.querySelector<HTMLElement>('[data-slot="carousel"]');
    const viewport = document.querySelector<HTMLElement>('[data-slot="carousel-viewport"]');
    const item = document.querySelector<HTMLElement>('[data-slot="carousel-item"]');
    const media = document.querySelector<HTMLElement>('[data-slot="carousel-media"]');
    const caption = document.querySelector<HTMLElement>('[data-slot="carousel-caption"]');
    const previous = document.querySelector<HTMLElement>('[data-slot="carousel-previous"]');
    const next = document.querySelector<HTMLElement>('[data-slot="carousel-next"]');
    const indicators = document.querySelector<HTMLElement>('[data-slot="carousel-indicators"]');

    if (!root || !viewport || !item || !media || !caption || !previous || !next || !indicators) {
      throw new Error("Vertical Carousel parts were not rendered.");
    }

    const viewportRect = viewport.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    const captionRect = caption.getBoundingClientRect();
    const indicatorsRect = indicators.getBoundingClientRect();

    expect(previous.textContent).toBe("↑");
    expect(next.textContent).toBe("↓");
    expect(viewportRect.height).toBeGreaterThan(0);
    expect(itemRect.height).toBeGreaterThan(0);
    expect(mediaRect.height).toBeGreaterThan(0);
    expect(captionRect.height).toBeGreaterThan(0);
    expect(captionRect.bottom).toBeLessThanOrEqual(itemRect.bottom + 1);
    expect(getComputedStyle(indicators).flexDirection).toBe("column");
    expect(indicatorsRect.left).toBeGreaterThanOrEqual(viewportRect.right - 1);
    expect(indicatorsRect.right).toBeLessThanOrEqual(root.getBoundingClientRect().right + 1);
    expect(root.getBoundingClientRect().height).toBeGreaterThanOrEqual(viewportRect.height);
  },
};

export const CustomControls: Story = {
  render: (args) => (
    <Carousel.Root {...args} aria-label="Custom controls" style={{ maxWidth: "40rem" }}>
      <Carousel.Viewport>
        <Carousel.Track>
          {slides.map((slide, index) => (
            <Carousel.Item index={index} key={slide.title}>
              <Text
                style={{
                  background: "var(--jaci-colors-surface-subtle)",
                  padding: "5rem",
                  textAlign: "center",
                }}
              >
                {slide.title}
              </Text>
            </Carousel.Item>
          ))}
        </Carousel.Track>
      </Carousel.Viewport>
      <Stack direction="horizontal" justify="between" gap="sm">
        <Carousel.Previous>Previous</Carousel.Previous>
        <Carousel.Next>Next</Carousel.Next>
      </Stack>
    </Carousel.Root>
  ),
};
