import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Text } from "jaci-ui";

const meta = {
  title: "Content/Card",
  tags: ["autodocs"],
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
      {(["outline", "elevated", "subtle"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle>{variant}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text tone="muted">A flexible surface for grouped content.</Text>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="solid">
              Action
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};
