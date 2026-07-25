import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataView as JaciDataView,
  List,
  Pagination,
  Text,
} from "jaci-ui";

const meta = {
  title: "Data Display/DataView",
  tags: ["autodocs", "test"],
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
    <JaciDataView.Root status="loading" aria-label="Project results">
      <JaciDataView.Toolbar>
        <Text>Project results</Text>
      </JaciDataView.Toolbar>
      <JaciDataView.Filters>
        <Text size="sm" tone="muted">
          Filters are controlled by the app.
        </Text>
      </JaciDataView.Filters>
      <JaciDataView.Loading />
      <JaciDataView.Empty>No matching records.</JaciDataView.Empty>
      <JaciDataView.Error>Unable to load records.</JaciDataView.Error>
      <JaciDataView.Footer>
        <JaciDataView.Pagination>
          <Pagination.Root page={1} pageCount={3} />
        </JaciDataView.Pagination>
      </JaciDataView.Footer>
    </JaciDataView.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DataView.Root layout="table" status="loading" aria-busy="true">
  <DataView.Toolbar>Projects</DataView.Toolbar>
  <DataView.Filters>{/* app-controlled filters */}</DataView.Filters>
  <DataView.Content>{/* Table.Root, List.Root or cards */}</DataView.Content>
  <DataView.Loading />
  <DataView.Footer>
    <DataView.Pagination><Pagination.Root pageCount={3} /></DataView.Pagination>
  </DataView.Footer>
</DataView.Root>`,
      },
    },
  },
};
