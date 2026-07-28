import { defineRecipe } from "@pandacss/dev";

export const statGroupRecipe = defineRecipe({
  className: "statGroup",
  base: {
    display: "grid",
    minWidth: "0",
  },
  variants: {
    columns: {
      1: { gridTemplateColumns: "minmax(0, 1fr)" },
      2: {
        gridTemplateColumns: { base: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
      },
      3: {
        gridTemplateColumns: {
          base: "minmax(0, 1fr)",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
      },
      4: {
        gridTemplateColumns: {
          base: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
      },
    },
    gap: {
      sm: { gap: "2" },
      md: { gap: "4" },
      lg: { gap: "6" },
    },
  },
  defaultVariants: { columns: 3, gap: "md" },
  staticCss: ["*"],
});
