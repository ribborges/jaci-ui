import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, DataToolbar, DataView as JaciDataView, Pagination, Table, Text } from "jaci-ui";

const meta = {
  title: "Data Display/DataToolbar",
  tags: ["autodocs", "test"],
  component: DataToolbar.Root,
} satisfies Meta<typeof DataToolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const projects = [
  { id: "jaci", name: "Jaci UI", status: "Ready" },
  { id: "docs", name: "Documentation", status: "In review" },
  { id: "site", name: "Marketing site", status: "Draft" },
];

export const TableComposition: Story = {
  render: function DataToolbarTableStory() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");
    const [selected, setSelected] = useState<string[]>([]);
    const visibleProjects = projects.filter((project) =>
      project.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );

    return (
      <JaciDataView.Root layout="table" status="ready" aria-label="Projects">
        <DataToolbar.Root aria-label="Project tools">
          <DataToolbar.Search
            aria-label="Search projects"
            placeholder="Search projects"
            value={search}
            onValueChange={setSearch}
          />
          <DataToolbar.Filters>
            <DataToolbar.Sort aria-label="Sort projects" value={sort} onValueChange={setSort}>
              <option value="name">Name</option>
              <option value="status">Status</option>
            </DataToolbar.Sort>
          </DataToolbar.Filters>
          <DataToolbar.Selection count={selected.length} onClear={() => setSelected([])}>
            <Text size="sm">{selected.length} selected</Text>
            <DataToolbar.ClearSelection />
          </DataToolbar.Selection>
          <DataToolbar.Actions>
            <Button size="sm" onClick={() => undefined}>
              Export
            </Button>
            <Button size="sm" variant="danger" disabled={selected.length === 0}>
              Delete
            </Button>
          </DataToolbar.Actions>
          <DataToolbar.Clear onClick={() => setSearch("")} />
        </DataToolbar.Root>
        <JaciDataView.Content>
          <Table.Container>
            <Table.Root
              selectionMode="multiple"
              selectedRowIds={selected}
              onSelectionChange={setSelected}
            >
              <Table.Caption>Projects</Table.Caption>
              <Table.Header>
                <Table.Row id="projects-header">
                  <Table.SelectionHeader />
                  <Table.Head id="name">Name</Table.Head>
                  <Table.Head id="status">Status</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {visibleProjects.map((project) => (
                  <Table.Row id={project.id} key={project.id}>
                    <Table.SelectionCell />
                    <Table.Cell>{project.name}</Table.Cell>
                    <Table.Cell>{project.status}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.Container>
        </JaciDataView.Content>
        <JaciDataView.Footer>
          <JaciDataView.Pagination>
            <Pagination.Root pageCount={3} showFirstLast />
          </JaciDataView.Pagination>
        </JaciDataView.Footer>
      </JaciDataView.Root>
    );
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DataToolbar.Root aria-label="Project tools">
  <DataToolbar.Search value={search} onValueChange={setSearch} />
  <DataToolbar.Filters>
    <DataToolbar.Sort value={sort} onValueChange={setSort}>
      <option value="name">Name</option>
      <option value="status">Status</option>
    </DataToolbar.Sort>
  </DataToolbar.Filters>
  <DataToolbar.Selection count={selected.length} onClear={clearSelection}>
    <DataToolbar.ClearSelection />
  </DataToolbar.Selection>
  <DataToolbar.Actions><Button>Export</Button></DataToolbar.Actions>
</DataToolbar.Root>

<DataView.Root layout="table">
  <DataView.Content><Table.Root>{/* rows */}</Table.Root></DataView.Content>
  <DataView.Footer><Pagination.Root pageCount={3} /></DataView.Footer>
</DataView.Root>`,
      },
    },
  },
};

export const Standalone: Story = {
  render: () => (
    <DataToolbar.Root aria-label="Content tools">
      <DataToolbar.Search aria-label="Search content" placeholder="Search content" />
      <DataToolbar.Separator />
      <DataToolbar.Actions>
        <Button size="sm">Create</Button>
      </DataToolbar.Actions>
    </DataToolbar.Root>
  ),
};
