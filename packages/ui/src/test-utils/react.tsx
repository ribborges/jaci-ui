import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterAll, afterEach, beforeAll } from "vitest";
import type { ReactElement } from "react";

const roots: ReturnType<typeof createRoot>[] = [];
const reactTestEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
let previousActEnvironment: boolean | undefined;

beforeAll(() => {
  previousActEnvironment = reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT;
  reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
});

afterAll(() => {
  if (previousActEnvironment === undefined) delete reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT;
  else reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
});

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
});

/** Renders a component into an isolated document container and cleans it up after each test. */
export function renderInDocument(element: ReactElement) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => root.render(element));
  return container;
}
