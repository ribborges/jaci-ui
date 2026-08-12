import type { Metadata } from "next";
import type { ReactNode } from "react";
import "jaci-ui/styles.css";

import { NextThemeScope } from "./theme-client";

export const metadata: Metadata = {
  title: "Jaci UI Next fixture",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-jaci-theme="light" lang="en">
      <body>
        <NextThemeScope>{children}</NextThemeScope>
      </body>
    </html>
  );
}
