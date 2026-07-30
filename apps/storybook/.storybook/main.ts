import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    const rawBase = process.env.STORYBOOK_BASE_PATH ?? "/";
    const normalizedBase = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

    return mergeConfig(config, {
      base: normalizedBase,
    });
  },
};

export default config;
