import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Testes de integração (*.int.test.ts) só rodam quando há banco disponível
    // (TEST_DATABASE_URL); os unitários rodam sempre.
    include: ["src/**/*.test.ts"],
  },
});
