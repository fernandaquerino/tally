import config from "@tally/config/eslint";
import storybook from "eslint-plugin-storybook";

// https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
export default [...config, ...storybook.configs["flat/recommended"]];
