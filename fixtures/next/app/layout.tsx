import type { Metadata } from "next";
import type { ReactNode } from "react";
import "jaci-ui/styles.css";

export const metadata: Metadata = {
  title: "Jaci UI Next fixture",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-jaci-theme="light" lang="en">
      <body>{children}</body>
    </html>
  );
}
