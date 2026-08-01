import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Avatar } from "../../index";

describe("Avatar", () => {
  it("renders an accessible fallback during SSR", () => {
    const html = renderToString(
      <Avatar.Root aria-label="Richard">
        <Avatar.Fallback>RB</Avatar.Fallback>
      </Avatar.Root>,
    );

    expect(html).toContain('data-jaci-component="avatar"');
    expect(html).toContain('data-slot="avatar-fallback"');
    expect(html).toContain("RB");
  });
});
