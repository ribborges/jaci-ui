# Contributing to Jaci UI

Thank you for improving Jaci UI.

## Development

Use Node 22.18 or newer and Corepack. Install dependencies with pnpm install, then use
pnpm storybook for component work. Run pnpm format, pnpm lint, pnpm typecheck, pnpm test
and pnpm build before opening a pull request.

The published package supports consumer applications on Node 18.18 or newer. The higher
Node 22.18 requirement applies only to repository development and CI tooling (including the
current tsdown release). The publish workflow uses Node 24.

The default Storybook test command is safe in restricted local environments. To run the full
Chromium story suite locally, use `pnpm --filter @jaci-ui/storybook test:browser`; CI enables the
same browser mode automatically.

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

Before opening a release pull request, run `pnpm package:contract`,
`pnpm performance:check` and `pnpm compatibility:check`. These checks exercise the packed
tarball rather than the workspace link, including its ESM/CJS exports, types, sourcemaps,
static CSS and framework fixtures. Keep the performance baseline file versioned and explain
any intentional baseline update in the pull request.

Jaci UI remains in the `0.x` phase until the public API and styling contracts have stabilized.
During this phase, a minor release may include a backwards-compatible feature or a documented
behavior adjustment, while breaking changes still require a major release and migration notes.
The initial `0.1.0` release is the clean baseline; do not add Changesets for work that is already
included in that baseline.
