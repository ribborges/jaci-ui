import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "jaci-ui";

const meta = {
  title: "Navigation/Pagination",
  tags: ["autodocs", "test"],
  component: Pagination.Root,
} satisfies Meta<typeof Pagination.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function PageLinks({ focusPage }: { focusPage?: number }) {
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous href="#page-2" />
        </Pagination.Item>
        {[1, 2, 3].map((page) => (
          <Pagination.Item key={page}>
            <Pagination.Link
              active={page === 2}
              autoFocus={focusPage === page}
              href={`#page-${page}`}
            >
              {page}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href="#page-12">12</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next href="#page-4" />
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

export const Default: Story = {
  render: () => <PageLinks />,
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div style={{ maxWidth: "22rem" }}>
      <PageLinks />
    </div>
  ),
};

export const GeneratedPages: Story = {
  render: () => <Pagination.Root defaultPage={5} pageCount={12} showFirstLast siblingCount={1} />,
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Pagination.Root
  defaultPage={5}
  pageCount={12}
  showFirstLast
  siblingCount={1}
  onPageChange={setPage}
/>`,
      },
    },
  },
};

export const ControlledCompact: Story = {
  render: function ControlledPagination() {
    const [page, setPage] = useState(1);
    return (
      <Pagination.Root
        density="compact"
        page={page}
        pageCount={5}
        onPageChange={setPage}
        showFirstLast
      />
    );
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Pagination.Root
  density="compact"
  page={page}
  pageCount={5}
  onPageChange={setPage}
  showFirstLast
/>`,
      },
    },
  },
};

export const FocusAndDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Page 2 starts focused; unavailable directional links are removed from tab order.",
      },
    },
  },
  render: () => (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous disabled />
        </Pagination.Item>
        {[1, 2, 3].map((page) => (
          <Pagination.Item key={page}>
            <Pagination.Link active={page === 2} autoFocus={page === 2} href={`#page-${page}`}>
              {page}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next disabled />
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div data-jaci-theme="dark" style={{ padding: "1.5rem" }}>
      <PageLinks />
    </div>
  ),
};
