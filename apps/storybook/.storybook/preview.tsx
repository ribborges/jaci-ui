import type { Preview } from "@storybook/react-vite";

import { ThemeProvider } from "jaci-ui";
import "jaci-ui/styles.css";

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <ThemeProvider
        theme={context.globals.theme}
        style={{
          boxSizing: "border-box",
          maxWidth: "none",
          minHeight: "100vh",
          minWidth: 0,
          padding: "2rem",
          width: "100%",
        }}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  globalTypes: {
    theme: {
      description: "Jaci UI theme",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      expanded: true,
    },
    layout: "centered",
  },
};

export default preview;
