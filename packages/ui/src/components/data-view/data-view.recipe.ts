import { defineSlotRecipe } from "@pandacss/dev";

export const dataViewRecipe = defineSlotRecipe({
  className: "data-view",
  slots: ["root", "toolbar", "content", "loading", "empty", "error"],
  base: {
    root: {
      color: "fg.default",
      display: "flex",
      flexDirection: "column",
      gap: "4",
      minWidth: "0",
      width: "100%",
      "&[data-layout='table'] [data-slot='data-view-content']": {
        overflowX: "auto",
      },
      "&[data-layout='list'] [data-slot='data-view-content']": {
        display: "flex",
        flexDirection: "column",
      },
      "&[data-layout='grid'] [data-slot='data-view-content']": {
        display: "grid",
        gap: "4",
      },
      "&[data-layout='grid'][data-columns='1'] [data-slot='data-view-content']": {
        gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      },
      "&[data-layout='grid'][data-columns='2'] [data-slot='data-view-content']": {
        gridTemplateColumns: {
          base: "repeat(1, minmax(0, 1fr))",
          md: "repeat(2, minmax(0, 1fr))",
        },
      },
      "&[data-layout='grid'][data-columns='3'] [data-slot='data-view-content']": {
        gridTemplateColumns: {
          base: "repeat(1, minmax(0, 1fr))",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
      },
      "&[data-layout='grid'][data-columns='4'] [data-slot='data-view-content']": {
        gridTemplateColumns: {
          base: "repeat(1, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
      },
    },
    toolbar: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: "3",
      justifyContent: "space-between",
    },
    content: {
      minWidth: "0",
      width: "100%",
    },
    loading: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      justifyContent: "center",
      minHeight: "24",
      padding: "8",
      textAlign: "center",
    },
    empty: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      justifyContent: "center",
      minHeight: "24",
      padding: "8",
      textAlign: "center",
    },
    error: {
      backgroundColor: "surface.raised",
      borderColor: "danger",
      borderRadius: "lg",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "danger",
      padding: "4",
    },
  },
  variants: {
    layout: {
      table: { content: { overflowX: "auto" } },
      list: { content: { display: "flex", flexDirection: "column" } },
      grid: { content: { display: "grid", gap: "4" } },
    },
    columns: {
      1: { content: { gridTemplateColumns: "repeat(1, minmax(0, 1fr))" } },
      2: {
        content: {
          gridTemplateColumns: {
            base: "repeat(1, minmax(0, 1fr))",
            md: "repeat(2, minmax(0, 1fr))",
          },
        },
      },
      3: {
        content: {
          gridTemplateColumns: {
            base: "repeat(1, minmax(0, 1fr))",
            md: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
        },
      },
      4: {
        content: {
          gridTemplateColumns: {
            base: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        },
      },
    },
  },
  defaultVariants: { columns: 3, layout: "list" },
  staticCss: ["*"],
});
