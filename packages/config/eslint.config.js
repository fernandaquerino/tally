import eslint from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "dist/**", "coverage/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Desliga regras de estilo que conflitariam com o Prettier. Precisa ser o
  // último item para sobrescrever as configs anteriores.
  configPrettier,
);
