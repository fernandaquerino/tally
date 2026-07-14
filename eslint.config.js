// Config raiz usada por ferramentas invocadas na raiz do monorepo (ex.: o
// `eslint --fix` do lint-staged no pre-commit). Cada workspace mantém seu
// próprio `eslint.config.js` para o `turbo lint` da CI.
import config from "@tally/config/eslint";

export default [
  ...config,
  {
    // ADR-0006: `parseFloat` reintroduz erro de ponto flutuante em dinheiro.
    files: ["packages/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "parseFloat",
          message:
            "Dinheiro em centavos (ADR-0006): não use parseFloat. Use os helpers de @tally/shared/money.",
        },
      ],
    },
  },
];
