"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "jaci-ui";

export function NextThemeScope({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" ssrTheme="light">
      {children}
    </ThemeProvider>
  );
}
