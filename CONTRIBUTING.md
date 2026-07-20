# Contributing to Jaci UI

Thank you for improving Jaci UI.

## Development

Use Node 22.14 or newer and Corepack. Install dependencies with pnpm install, then use
pnpm storybook for component work. Run pnpm format, pnpm lint, pnpm typecheck, pnpm test
and pnpm build before opening a pull request.

## Component expectations

Public components must use semantic HTML, expose TypeScript types, forward refs when a DOM
element is rendered, and work with light and dark themes. Use Panda tokens and recipes
instead of hard-coded visual values. Document all supported variants and important states in
Storybook.

Interactive components must be keyboard accessible, retain focus correctly, and include a
use client boundary when required by React Server Components.

## Test organization

Keep unit and interaction tests next to the component they cover, using the component name as
the test file name (for example, `components/command/command.test.tsx`). Shared concerns that
cross component families belong at the package root: `ssr.test.tsx` covers server rendering and
`hydration.test.tsx` covers client hydration. Avoid release or milestone names in test files;
tests should describe the public behavior they protect. Run the package tests with
`pnpm --filter jaci-ui test` while developing a component.

## Releases

Add a Changeset for any public API, behavior, accessibility or styling change that warrants a
package release. Use patch for fixes, minor for backwards-compatible features, and major for
breaking changes.
