import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenu, Stack, Text } from "jaci-ui";

const meta = {
  component: NavigationMenu.Root,
  title: "Navigation/NavigationMenu",
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item value="components">
          <NavigationMenu.Trigger>
            Components <NavigationMenu.Icon />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content keepMounted>
            <Stack gap="sm">
              <NavigationMenu.Link href="/button">Button</NavigationMenu.Link>
              <NavigationMenu.Link href="/dialog">Dialog</NavigationMenu.Link>
            </Stack>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link active href="/docs">
            Documentation
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  ),
};

export const Vertical: Story = {
  render: () => (
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List>
        <NavigationMenu.Item value="guides">
          <NavigationMenu.Trigger>
            Guides <NavigationMenu.Icon />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <Text>Getting started with Jaci UI.</Text>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/api">API reference</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  ),
};

export const ProportionalPopup: Story = {
  render: () => (
    <div style={{ maxWidth: "100%", overflow: "hidden", width: "26rem" }}>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="short">
            <NavigationMenu.Trigger>
              Short menu <NavigationMenu.Icon />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="#button">Button</NavigationMenu.Link>
              <NavigationMenu.Link href="#card">Card</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="long">
            <NavigationMenu.Trigger>
              Longer examples <NavigationMenu.Icon />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <Stack gap="sm">
                <NavigationMenu.Link href="#installation">
                  Installation and setup for a new project
                </NavigationMenu.Link>
                <NavigationMenu.Link href="#theming">
                  Theme customization and scoped tokens
                </NavigationMenu.Link>
              </Stack>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item value="components">
      <NavigationMenu.Trigger>Components <NavigationMenu.Icon /></NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/button">Button</NavigationMenu.Link>
        <NavigationMenu.Link href="/dialog">Dialog</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
  <NavigationMenu.Viewport />
</NavigationMenu.Root>`,
      },
    },
  },
};
