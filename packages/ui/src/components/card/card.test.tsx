import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Card } from "../../index";

describe("Card", () => {
  it("renders the compositional regions during SSR", () => {
    const html = renderToString(
      <Card.Root variant="elevated">
        <Card.Header>Header</Card.Header>
        <Card.Title>Project</Card.Title>
        <Card.Content>Details</Card.Content>
        <Card.Footer>Actions</Card.Footer>
      </Card.Root>,
    );

    expect(html).toContain('data-jaci-component="card"');
    expect(html).toContain('data-slot="card-header"');
    expect(html).toContain('data-slot="card-content"');
    expect(html).toContain('data-slot="card-footer"');
  });
});
