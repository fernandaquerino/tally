import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/app/QueryProvider";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import "./styles.css";
import { Toaster } from "@/components/feedback/Toaster";

export const metadata: Metadata = {
  title: "Tally",
  description: "Finanças PF e PJ no mesmo lugar.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: extensões (ex.: Grammarly) injetam atributos
          no <body> antes da hidratação; o warning é ruído, não bug do app. */}
      <body className={geistSans.className} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system">
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
