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
  webpackFinal: async (baseConfig) => {
    if (!baseConfig.resolve) {
      baseConfig.resolve = {};
    }

    if (!baseConfig.resolve.alias) {
      baseConfig.resolve.alias = {};
    }

    // Define an alias for "@/"
    baseConfig.resolve.alias["@"] = path.resolve(__dirname, "../");

    return baseConfig;
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
