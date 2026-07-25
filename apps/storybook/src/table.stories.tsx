import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Table, Text } from "jaci-ui";
import type { TableSortState } from "jaci-ui";

const meta = {
  title: "Data Display/Table",
  component: Table.Root,
  tags: ["autodocs", "test"],
} satisfies Meta<typeof Table.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const users = [
  { email: "ada@example.com", name: "Ada Lovelace", role: "Admin" },
  { email: "grace@example.com", name: "Grace Hopper", role: "Editor" },
  { email: "margaret@example.com", name: "Margaret Hamilton", role: "Viewer" },
];

function InteractiveTable() {
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const sortedUsers = useMemo(() => {
    if (!sort) return users;
    return [...users].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sort.direction === "descending" ? -comparison : comparison;
    });
  }, [sort]);

  return (
    <Table.Container>
      <Table.Description id="members-description">
        Select members or sort the table by name.
      </Table.Description>
      <Table.Root
        striped
        aria-describedby="members-description"
        selectionMode="multiple"
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        sort={sort}
        onSortChange={setSort}
      >
        <Table.Caption>Workspace members</Table.Caption>
        <Table.Header>
          <Table.Row id="workspace-members-header">
            <Table.SelectionHeader />
            <Table.Head id="name" sortable>
              Name
            </Table.Head>
            <Table.Head id="email" hideBelow="sm">
              Email
            </Table.Head>
            <Table.Head id="role" align="center">
              Role
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedUsers.map((user) => {
            const isSelected = selected.includes(user.email);
            return (
              <Table.Row id={user.email} key={user.email} selected={isSelected}>
                <Table.SelectionCell />
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell hideBelow="sm">{user.email}</Table.Cell>
                <Table.Cell align="center">
                  <Badge tone="accent">{user.role}</Badge>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Table.Container>
  );
}

const sortableSource = `const [sort, setSort] = useState<TableSortState | null>(null);
const [selected, setSelected] = useState<string[]>([]);

<Table.Container>
  <Table.Description id="members-description">
    Select members or sort the table by name.
  </Table.Description>
  <Table.Root
    striped
    aria-describedby="members-description"
    selectionMode="multiple"
    selectedRowIds={selected}
    onSelectionChange={setSelected}
    sort={sort}
    onSortChange={setSort}
  >
    <Table.Caption>Workspace members</Table.Caption>
    <Table.Header>
      <Table.Row id="source-header">
        <Table.SelectionHeader />
        <Table.Head id="name" sortable>
          Name
        </Table.Head>
        <Table.Head>Email</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {users.map((user) => (
        <Table.Row id={user.email} key={user.email} selected={selected.includes(user.email)}>
          <Table.SelectionCell />
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
</Table.Container>`;

export const SortableAndSelectable: Story = {
  render: () => <InteractiveTable />,
  parameters: { docs: { source: { code: sortableSource, language: "tsx" } } },
};

export const Empty: Story = {
  render: () => (
    <Table.Container>
      <Table.Root bordered>
        <Table.Caption>
          <Text>No active projects</Text>
        </Table.Caption>
        <Table.Header>
          <Table.Row id="empty-table-header">
            <Table.Head>Project</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Empty colSpan={2}>Create a project to see it here.</Table.Empty>
        </Table.Body>
      </Table.Root>
    </Table.Container>
  ),
};

export const StatusesAndDensity: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Table.Container>
        <Table.Root density="compact" status="loading" bordered>
          <Table.Caption>Compact loading table</Table.Caption>
          <Table.Header>
            <Table.Row id="loading-header">
              <Table.Head id="project">Project</Table.Head>
              <Table.Head id="owner" align="end">
                Owner
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Loading colSpan={2}>Loading projects…</Table.Loading>
          </Table.Body>
        </Table.Root>
      </Table.Container>
      <Table.Container>
        <Table.Root status="error" bordered>
          <Table.Caption>Projects</Table.Caption>
          <Table.Body>
            <Table.Error colSpan={2}>Could not load projects.</Table.Error>
          </Table.Body>
        </Table.Root>
      </Table.Container>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Table.Root density="compact" status="loading" bordered aria-busy="true">
  <Table.Caption>Projects</Table.Caption>
  <Table.Body>
    <Table.Loading colSpan={2}>Loading projects…</Table.Loading>
  </Table.Body>
</Table.Root>`,
      },
    },
  },
};
