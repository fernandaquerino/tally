import type { Preview } from "@storybook/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

// Carrega Tailwind + design tokens (@theme) para as stories renderizarem
// com os mesmos estilos da aplicação.
import "../src/app/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Story />
      </div>
    ),
  ],
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
