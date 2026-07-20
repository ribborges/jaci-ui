import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "jaci-ui";

const meta = {
  title: "Navigation/Breadcrumbs",
  tags: ["autodocs"],
  component: Breadcrumbs.Root,
} satisfies Meta<typeof Breadcrumbs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function ProjectPath({ focusLink = false }: { focusLink?: boolean }) {
  return (
    <Breadcrumbs.Root>
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link autoFocus={focusLink} href="#home">
            Home
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#projects">Projects</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item>
          <Breadcrumbs.Current>Jaci UI</Breadcrumbs.Current>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}

export const Default: Story = {
  render: () => <ProjectPath />,
};

export const ResponsiveOverflow: Story = {
  render: () => (
    <div style={{ maxWidth: "20rem" }}>
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#workspace">Workspace</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#components">
              Components with a deliberately long path segment
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Accessibility review</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </div>
  ),
};

export const FocusVisible: Story = {
  parameters: {
    docs: {
      description: {
        story: "The first link starts focused to document the keyboard focus treatment.",
      },
    },
  },
  render: () => <ProjectPath focusLink />,
};

export const DarkTheme: Story = {
  render: () => (
    <div data-jaci-theme="dark" style={{ padding: "1.5rem" }}>
      <ProjectPath />
    </div>
  ),
};
