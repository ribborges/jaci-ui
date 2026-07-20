import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenu, Stack, Text } from "jaci-ui";

const meta = { title: "Navigation/NavigationMenu", tags: ["autodocs"] } satisfies Meta;
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
