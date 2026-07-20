import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataView as JaciDataView,
  List,
  Text,
} from "jaci-ui";

const meta = {
  title: "Data Display/DataView",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  render: () => (
    <JaciDataView.Root layout="grid" columns={3}>
      <JaciDataView.Toolbar>
        <Text style={{ fontWeight: 600 }}>Recent projects</Text>
      </JaciDataView.Toolbar>
      <JaciDataView.Content>
        {["Jaci UI", "Marketing site", "Mobile app"].map((project) => (
          <Card key={project} variant="elevated">
            <CardHeader>
              <CardTitle>{project}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text tone="muted">Ready for review.</Text>
            </CardContent>
          </Card>
        ))}
      </JaciDataView.Content>
    </JaciDataView.Root>
  ),
};

export const ListLayout: Story = {
  render: () => (
    <JaciDataView.Root layout="list">
      <JaciDataView.Toolbar>
        <Text>Activity</Text>
      </JaciDataView.Toolbar>
      <JaciDataView.Content>
        <List.Root variant="divided">
          <List.Item>
            <List.ItemContent>
              <List.ItemTitle>Build completed</List.ItemTitle>
              <List.ItemDescription>2 minutes ago</List.ItemDescription>
            </List.ItemContent>
          </List.Item>
          <List.Item>
            <List.ItemContent>
              <List.ItemTitle>New contributor</List.ItemTitle>
              <List.ItemDescription>Yesterday</List.ItemDescription>
            </List.ItemContent>
          </List.Item>
        </List.Root>
      </JaciDataView.Content>
    </JaciDataView.Root>
  ),
};

export const States: Story = {
  render: () => (
    <JaciDataView.Root>
      <JaciDataView.Loading />
      <JaciDataView.Empty>No matching records.</JaciDataView.Empty>
      <JaciDataView.Error>Unable to load records.</JaciDataView.Error>
    </JaciDataView.Root>
  ),
};
