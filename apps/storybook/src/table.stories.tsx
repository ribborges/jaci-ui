import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Table, Text } from "jaci-ui";

const meta = {
  title: "Data Display/Table",
  component: Table.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Table.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const users = [
  { email: "ada@example.com", name: "Ada Lovelace", role: "Admin" },
  { email: "grace@example.com", name: "Grace Hopper", role: "Editor" },
  { email: "margaret@example.com", name: "Margaret Hamilton", role: "Viewer" },
];

function InteractiveTable() {
  const [direction, setDirection] = useState<"none" | "ascending" | "descending">("none");
  const [selected, setSelected] = useState<string[]>([]);
  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) =>
        direction === "descending" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name),
      ),
    [direction],
  );
  const allSelected = selected.length === users.length;
  const someSelected = selected.length > 0 && !allSelected;

  function toggleAll(checked: boolean) {
    setSelected(checked ? users.map((user) => user.email) : []);
  }

  return (
    <Table.Container>
      <Table.Root striped>
        <Table.Caption>Workspace members</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.SelectionHeader
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={toggleAll}
            />
            <Table.Head
              onSort={() => setDirection(direction === "ascending" ? "descending" : "ascending")}
              sortDirection={direction}
              sortable
            >
              Name
            </Table.Head>
            <Table.Head>Email</Table.Head>
            <Table.Head>Role</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedUsers.map((user) => {
            const isSelected = selected.includes(user.email);
            return (
              <Table.Row key={user.email} selected={isSelected}>
                <Table.SelectionCell
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    setSelected((current) =>
                      checked
                        ? [...current, user.email]
                        : current.filter((email) => email !== user.email),
                    )
                  }
                />
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
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

const sortableSource = `const [sortDirection, setSortDirection] = useState<
  "none" | "ascending" | "descending"
>("none");
const [selected, setSelected] = useState<string[]>([]);

<Table.Container>
  <Table.Root striped>
    <Table.Caption>Workspace members</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.SelectionHeader
          checked={selected.length === users.length}
          indeterminate={selected.length > 0 && selected.length < users.length}
          onCheckedChange={(checked) => setSelected(checked ? users.map((user) => user.email) : [])}
        />
        <Table.Head
          sortable
          sortDirection={sortDirection}
          onSort={() => setSortDirection(sortDirection === "ascending" ? "descending" : "ascending")}
        >
          Name
        </Table.Head>
        <Table.Head>Email</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {users.map((user) => (
        <Table.Row key={user.email} selected={selected.includes(user.email)}>
          <Table.SelectionCell
            checked={selected.includes(user.email)}
            onCheckedChange={(checked) => {
              setSelected((current) =>
                checked
                  ? [...current, user.email]
                  : current.filter((email) => email !== user.email),
              );
            }}
          />
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
          <Table.Row>
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
