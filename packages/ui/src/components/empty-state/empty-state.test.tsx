// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { EmptyState } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("EmptyState", () => {
  it("provides composable slots for an empty data view", () => {
    const container = renderInDocument(
      <EmptyState.Root>
        <EmptyState.Icon aria-hidden="true">∅</EmptyState.Icon>
        <EmptyState.Title>No projects</EmptyState.Title>
        <EmptyState.Description>Create your first project.</EmptyState.Description>
      </EmptyState.Root>,
    );
    expect(container.querySelector('[data-jaci-component="empty-state"]')).not.toBeNull();
    expect(container.textContent).toContain("No projects");
  });
});
