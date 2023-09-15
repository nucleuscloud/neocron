import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  webpackFinal: async (config, { configType }) => {
    // Define an alias for "@/"
    // baseConfig?.resolve?.alias?['@/'] = path.resolve(__dirname, "../src") // Adjust this path if it points somewhere else

    // return baseConfig;

    let mod = config.resolve?.modules;
    mod = [path.resolve(__dirname, ".."), "node_modules"];

    let alias = config?.resolve?.alias;

    alias = {
      ...config?.resolve?.alias,
      components: path.resolve(__dirname, "../"),
    };

    return config;
  },
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
