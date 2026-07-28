import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Text } from "jaci-ui";

const meta = {
  title: "Content/Card",
  tags: ["autodocs"],
  component: Card,
  args: { variant: "outline" },
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

export const Namespaced: Story = {
  render: () => (
    <Card.Root style={{ maxWidth: "28rem" }}>
      <Card.Header>
        <Card.Title>Project</Card.Title>
      </Card.Header>
      <Card.Content>
        <Text tone="muted">A composable card surface.</Text>
      </Card.Content>
      <Card.Footer>
        <Button size="sm">Open</Button>
      </Card.Footer>
    </Card.Root>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Card.Root>
  <Card.Header><Card.Title>Project</Card.Title></Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer><Button>Open</Button></Card.Footer>
</Card.Root>`,
      },
    },
  },
};
