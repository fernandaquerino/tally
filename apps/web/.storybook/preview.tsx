import type { Preview } from "@storybook/nextjs";

// Carrega Tailwind + design tokens (@theme) para as stories renderizarem
// com os mesmos estilos da aplicação.
import "../src/app/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
  },
};

export default preview;
