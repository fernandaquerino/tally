import config from "@tally/config/eslint";

export default [
  ...config,
  {
    // ADR-0006: dinheiro é sempre inteiro de centavos; `parseFloat` reintroduz
    // erro de ponto flutuante e fica proibido em todo o pacote.
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
