import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/nextjs";

/**
 * Resolve o caminho absoluto de um pacote — necessário em monorepos pnpm,
 * onde os pacotes não ficam achatados em `node_modules`.
 */
function getAbsolutePath(value: string): string {
  return dirname(
    fileURLToPath(import.meta.resolve(join(value, "package.json"))),
  );
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: getAbsolutePath("@storybook/nextjs"),
};

export default config;
