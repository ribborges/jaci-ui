import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "../../index";

describe("ScrollArea", () => {
  it("renders the viewport and scrollbar composition during SSR", () => {
    const html = renderToString(
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <ScrollArea.Content>Long content</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    expect(html).toContain('data-jaci-component="scroll-area"');
    expect(html).toContain('data-slot="scroll-area-viewport"');
    expect(html).toContain('data-slot="scroll-area-content"');
  });
});
