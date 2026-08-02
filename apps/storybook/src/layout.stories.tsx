import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Flex as FlexPrimitive,
  Grid as GridPrimitive,
  Separator,
  Spinner,
  Stack as StackPrimitive,
  Text,
} from "jaci-ui";
import type { LayoutAlign, LayoutGap, LayoutJustify, LayoutWrap } from "jaci-ui";

type LayoutDirection = "vertical" | "horizontal";
type GridColumns = 1 | 2 | 3 | 4;
type SeparatorOrientation = "horizontal" | "vertical";
type SpinnerSize = "sm" | "md" | "lg";

interface LayoutArgs {
  direction: LayoutDirection;
  gap: LayoutGap;
  align: LayoutAlign;
  justify: LayoutJustify;
  wrap: LayoutWrap;
  columns: GridColumns;
  separatorOrientation: SeparatorOrientation;
  spinnerSize: SpinnerSize;
}

const meta = {
  title: "Foundations/Layout",
  tags: ["autodocs"],
  component: StackPrimitive,
  parameters: {
    docs: {
      description: {
        component:
          "Composable layout primitives for arranging content with predictable gaps, alignment, wrapping, and responsive grid columns.",
      },
      source: {
        code: `<Stack gap="md">
  <Text>Content</Text>
</Stack>`,
      },
    },
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
      description: "Flow direction for Stack and Flex.",
      table: { category: "Stack / Flex" },
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Spacing between direct children.",
      table: { category: "Stack / Flex / Grid" },
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
      description: "Cross-axis alignment for Stack and Flex.",
      table: { category: "Stack / Flex" },
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between"],
      description: "Main-axis distribution for Stack and Flex.",
      table: { category: "Stack / Flex" },
    },
    wrap: {
      control: "inline-radio",
      options: ["nowrap", "wrap"],
      description: "Whether children can wrap onto another line.",
      table: { category: "Stack / Flex" },
    },
    columns: {
      control: "inline-radio",
      options: [1, 2, 3, 4],
      description: "Number of columns in Grid.",
      table: { category: "Grid" },
    },
    separatorOrientation: {
      name: "orientation",
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Orientation of the semantic Separator.",
      table: { category: "Separator" },
    },
    spinnerSize: {
      name: "size",
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Visual size of Spinner.",
      table: { category: "Spinner" },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<LayoutArgs>;

const itemStyle: React.CSSProperties = {
  alignItems: "center",
  background: "var(--jaci-colors-surface-raised)",
  border: "1px solid var(--jaci-colors-border-default)",
  borderRadius: "0.75rem",
  display: "flex",
  justifyContent: "center",
  minHeight: "4rem",
  minWidth: 0,
  padding: "1rem",
};

const frameStyle: React.CSSProperties = {
  border: "1px dashed var(--jaci-colors-border-default)",
  borderRadius: "0.75rem",
  maxWidth: "44rem",
  padding: "1rem",
  width: "100%",
};

function LayoutItems({ count = 4 }: { count?: number }) {
  const labels = ["One", "Two", "Three", "Four", "Five", "Six"];

  return (
    <>
      {labels.slice(0, count).map((label) => (
        <Text key={label} style={itemStyle}>
          Item {label}
        </Text>
      ))}
    </>
  );
}

export const StackPlayground: Story = {
  name: "Stack",
  args: {
    direction: "vertical",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
    columns: 3,
    separatorOrientation: "horizontal",
    spinnerSize: "md",
  },
  argTypes: {
    columns: { table: { disable: true } },
    separatorOrientation: { table: { disable: true } },
    spinnerSize: { table: { disable: true } },
  },
  render: ({ direction, gap, align, justify, wrap }) => (
    <StackPrimitive
      direction={direction}
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      style={frameStyle}
    >
      <LayoutItems />
    </StackPrimitive>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Stack direction="vertical" gap="md" align="stretch" justify="start" wrap="nowrap">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>`,
      },
    },
  },
};

export const FlexPlayground: Story = {
  name: "Flex",
  args: {
    direction: "horizontal",
    gap: "md",
    align: "center",
    justify: "between",
    wrap: "wrap",
    columns: 3,
    separatorOrientation: "horizontal",
    spinnerSize: "md",
  },
  argTypes: {
    columns: { table: { disable: true } },
    separatorOrientation: { table: { disable: true } },
    spinnerSize: { table: { disable: true } },
  },
  render: ({ direction, gap, align, justify, wrap }) => (
    <FlexPrimitive
      direction={direction}
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      style={frameStyle}
    >
      <LayoutItems />
    </FlexPrimitive>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Flex direction="horizontal" gap="md" align="center" justify="between" wrap="wrap">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Flex>`,
      },
    },
  },
};

export const GridPlayground: Story = {
  name: "Grid",
  args: {
    direction: "vertical",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
    columns: 3,
    separatorOrientation: "horizontal",
    spinnerSize: "md",
  },
  argTypes: {
    direction: { table: { disable: true } },
    align: { table: { disable: true } },
    justify: { table: { disable: true } },
    wrap: { table: { disable: true } },
    separatorOrientation: { table: { disable: true } },
    spinnerSize: { table: { disable: true } },
  },
  render: ({ columns, gap }) => (
    <GridPrimitive columns={columns} gap={gap} style={frameStyle}>
      <LayoutItems count={6} />
    </GridPrimitive>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Grid columns={3} gap="md">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Grid>`,
      },
    },
  },
};

export const SeparatorPlayground: Story = {
  name: "Separator",
  args: {
    direction: "vertical",
    gap: "md",
    align: "center",
    justify: "center",
    wrap: "nowrap",
    columns: 3,
    separatorOrientation: "horizontal",
    spinnerSize: "md",
  },
  argTypes: {
    direction: { table: { disable: true } },
    gap: { table: { disable: true } },
    align: { table: { disable: true } },
    justify: { table: { disable: true } },
    wrap: { table: { disable: true } },
    columns: { table: { disable: true } },
    spinnerSize: { table: { disable: true } },
  },
  render: ({ separatorOrientation }) =>
    separatorOrientation === "horizontal" ? (
      <StackPrimitive gap="md" style={frameStyle}>
        <Text>Section one</Text>
        <Separator orientation="horizontal" />
        <Text>Section two</Text>
      </StackPrimitive>
    ) : (
      <FlexPrimitive align="center" gap="md" style={{ ...frameStyle, minHeight: "8rem" }}>
        <Text>Start</Text>
        <Separator orientation="vertical" />
        <Text>End</Text>
      </FlexPrimitive>
    ),
  parameters: {
    docs: {
      source: {
        code: `<Separator orientation="horizontal" />
<Separator orientation="vertical" />`,
      },
    },
  },
};

export const SpinnerPlayground: Story = {
  name: "Spinner",
  args: {
    direction: "vertical",
    gap: "md",
    align: "center",
    justify: "center",
    wrap: "nowrap",
    columns: 3,
    separatorOrientation: "horizontal",
    spinnerSize: "md",
  },
  argTypes: {
    direction: { table: { disable: true } },
    gap: { table: { disable: true } },
    align: { table: { disable: true } },
    justify: { table: { disable: true } },
    wrap: { table: { disable: true } },
    columns: { table: { disable: true } },
    separatorOrientation: { table: { disable: true } },
  },
  render: ({ spinnerSize }) => (
    <FlexPrimitive align="center" gap="lg" style={frameStyle}>
      <Spinner size={spinnerSize} label="Loading content" />
      <Text>Loading content</Text>
    </FlexPrimitive>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Spinner size="md" label="Loading content" />`,
      },
    },
  },
};

export const LayoutPrimitives: Story = {
  name: "Composition",
  render: () => (
    <StackPrimitive gap="lg" style={frameStyle}>
      <FlexPrimitive align="center" justify="between" gap="md">
        <Text style={itemStyle}>Header</Text>
        <Text style={itemStyle}>Actions</Text>
      </FlexPrimitive>
      <Separator />
      <GridPrimitive columns={3} gap="md">
        <LayoutItems count={3} />
      </GridPrimitive>
      <FlexPrimitive align="center" gap="sm">
        <Spinner label="Loading composition" />
        <Text>Composed layout primitives</Text>
      </FlexPrimitive>
    </StackPrimitive>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Stack gap="lg">
  <Flex justify="between"><Text>Header</Text><Text>Actions</Text></Flex>
  <Separator />
  <Grid columns={3} gap="md">...</Grid>
</Stack>`,
      },
    },
  },
};
