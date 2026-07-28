// @vitest-environment jsdom

import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { Button, Stack } from "jaci-ui";
import "jaci-ui/styles.css";

const roots: ReturnType<typeof hydrateRoot>[] = [];

function App() {
  return (
    <Stack data-testid="consumer-app">
      <Button>Hydrated from a consumer app</Button>
    </Stack>
  );
}

describe("React 18 consumer hydration", () => {
  afterEach(() => {
    for (const root of roots.splice(0)) root.unmount();
    document.body.innerHTML = "";
  });

  it("hydrates the packed component tree without recoverable errors", async () => {
    const container = document.createElement("main");
    container.innerHTML = renderToString(<App />);
    document.body.append(container);

    const recoverableErrors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <App />, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
    });
    if (root) roots.push(root);

    expect(recoverableErrors).toHaveLength(0);
    expect(container.textContent).toContain("Hydrated from a consumer app");
  });
});
