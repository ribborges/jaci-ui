import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const configDir = fileURLToPath(new URL("./.storybook", import.meta.url));
const browserTestsEnabled = process.env.JACI_STORYBOOK_BROWSER === "1" || process.env.CI === "true";

// The addon checks VITEST while its plugin factory is evaluated. Vitest sets that
// flag after loading the config, so set it explicitly for the opt-in browser job.
if (browserTestsEnabled) process.env.VITEST = "1";

export default defineConfig({
  optimizeDeps: {
    include: [
      "@base-ui/react/alert-dialog",
      "@base-ui/react/avatar",
      "@base-ui/react/combobox",
      "@base-ui/react/context-menu",
      "@base-ui/react/dialog",
      "@base-ui/react/drawer",
      "@base-ui/react/field",
      "@base-ui/react/fieldset",
      "@base-ui/react/form",
      "@base-ui/react/menu",
      "@base-ui/react/menubar",
      "@base-ui/react/meter",
      "@base-ui/react/navigation-menu",
      "@base-ui/react/number-field",
      "@base-ui/react/popover",
      "@base-ui/react/radio",
      "@base-ui/react/radio-group",
      "@base-ui/react/scroll-area",
      "@base-ui/react/select",
      "@base-ui/react/slider",
      "@base-ui/react/toast",
      "@base-ui/react/toggle",
      "@base-ui/react/toggle-group",
      "@base-ui/react/tooltip",
      "@base-ui/react/toolbar",
    ],
  },
  test: browserTestsEnabled
    ? {
        projects: [
          {
            extends: true,
            plugins: [storybookTest({ configDir })],
            test: {
              name: "storybook",
              browser: {
                enabled: true,
                headless: true,
                provider: playwright(),
                api: { host: "127.0.0.1", port: 0 },
                instances: [{ browser: "chromium" }],
              },
            },
          },
        ],
      }
    : {
        include: [],
        passWithNoTests: true,
      },
});
