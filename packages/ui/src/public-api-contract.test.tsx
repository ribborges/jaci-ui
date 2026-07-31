// @vitest-environment jsdom

import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  AspectRatio,
  Button,
  ButtonGroup,
  Code,
  ColorPicker,
  ColorSwatch,
  DatePicker,
  Dialog,
  DownloadTrigger,
  Heading,
  Kbd,
  NavigationMenu,
  Paragraph,
  Quote,
  Separator,
  Spacer,
  Table,
  Text,
  ThemeProvider,
  VisuallyHidden,
} from "./index";
import { renderInDocument } from "./test-utils/react";

describe("public API contract", () => {
  it("keeps the foundational named exports and compatibility aliases", () => {
    for (const [name, value] of [
      ["Button", Button],
      ["Paragraph", Paragraph],
      ["Heading", Heading],
      ["Text", Text],
      ["DatePicker", DatePicker],
      ["ColorPicker", ColorPicker],
      ["Dialog", Dialog],
      ["NavigationMenu", NavigationMenu],
      ["Table", Table],
      ["ThemeProvider", ThemeProvider],
    ] as const) {
      expect(value, `${name} should remain a named export`).toBeDefined();
    }

    const html = renderToString(<Button render={<a href="/docs" />} />);
    expect(html).toContain('data-jaci-component="button"');
    expect(html).toContain('href="/docs"');
  });

  it("renders representative static families with stable component markers during SSR", () => {
    const html = renderToString(
      <>
        <AspectRatio ratio={16 / 9}>Content</AspectRatio>
        <Code variant="inline">const value = 1;</Code>
        <Kbd>⌘K</Kbd>
        <ColorSwatch color="#2563eb" label="Accent" />
        <DownloadTrigger href="/report.pdf">Download</DownloadTrigger>
        <Quote>Accessible quote</Quote>
        <Separator />
        <Spacer size="md" />
        <VisuallyHidden>Screen reader content</VisuallyHidden>
      </>,
    );

    expect(html).toContain("Content");
    expect(html).toContain("Accessible quote");
    expect(html).toContain('data-jaci-component="separator"');
    expect(html).not.toContain("window.");
  });

  it("keeps interactive roots available for hydration and stable markers", () => {
    const container = renderInDocument(
      <ButtonGroup aria-label="Actions">
        <Button>Save</Button>
        <Button disabled>Cancel</Button>
      </ButtonGroup>,
    );

    expect(container.querySelector('[data-jaci-component="button-group"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-jaci-component="button"]')).toHaveLength(2);
    expect(container.querySelector("button:disabled")).not.toBeNull();
  });
});
