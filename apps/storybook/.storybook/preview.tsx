import type { Preview } from "@storybook/react-vite";

import "jaci-ui/styles.css";

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <div data-jaci-theme={context.globals.theme} style={{ minHeight: "100vh", padding: "2rem" }}>
        <Story />
      </div>
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
