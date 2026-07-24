# Jaci UI

Accessible, themeable React components for React 18.2 and React 19 applications.

## Installation

```sh
pnpm add jaci-ui
# or: npm install jaci-ui
```

Import the static stylesheet once from the root of the application:

```tsx
import "jaci-ui/styles.css";
```

The package declares `react` and `react-dom` as peer dependencies. `@base-ui/react` is installed
as a runtime dependency for accessible interactive primitives.

## Usage

Components use named exports and compound APIs where several accessible parts work together:

```tsx
import { Button, ColorPicker, Stack } from "jaci-ui";

export function Example() {
  return (
    <Stack gap="md">
      <Button variant="solid">Continue</Button>

      <ColorPicker.Root defaultValue="#2563eb" name="brand-color">
        <ColorPicker.Label>Brand color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.Trigger aria-label="Choose brand color">
            <ColorPicker.Preview />
            <ColorPicker.Value />
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        <ColorPicker.Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Popup>
              <ColorPicker.Palette />
              <ColorPicker.Hue />
              <ColorPicker.Input />
              <ColorPicker.NativeInput />
            </ColorPicker.Popup>
          </ColorPicker.Positioner>
        </ColorPicker.Portal>
      </ColorPicker.Root>
    </Stack>
  );
}
```

Interactive components support controlled and uncontrolled state where appropriate. For example,
`value`/`onValueChange` can be paired with `defaultValue` when the application does not need to
own the state.

## Server rendering and frameworks

Static components are server-safe and interactive modules preserve their `"use client"` boundary.
In Next.js App Router, render interactive compositions inside a client component and import the
global stylesheet from `app/layout.tsx`:

```tsx
// app/layout.tsx
import "jaci-ui/styles.css";
```

Vite, React Router, Remix and other client entry points can import the stylesheet from their
application root. Jaci UI does not access `window`, `document`, storage or media APIs during
module import or server rendering.

## Themes and customization

Set `data-jaci-theme` on the server-rendered HTML element or on a local scope:

```tsx
<html data-jaci-theme="light">
  <body>{children}</body>
</html>
```

Use `data-jaci-theme="dark"` for the dark semantic palette. Brand colors can be changed with
the public CSS variables without a provider:

```css
:root {
  --jaci-colors-accent-default: #7c3aed;
  --jaci-colors-accent-hover: #6d28d9;
  --jaci-colors-fg-on-accent: #ffffff;
}

[data-jaci-theme="dark"] {
  --jaci-colors-accent-default: #a78bfa;
  --jaci-colors-accent-hover: #c4b5fd;
}
```

The package exposes semantic surface, foreground, border, status, spacing, radius, shadow and
transition tokens. See the Theming guide in Storybook for the complete token vocabulary.

## Optional Panda CSS preset

Applications that also use Panda CSS may import the optional preset:

```ts
import { defineConfig } from "@pandacss/dev";
import jaciPreset from "jaci-ui/panda-preset";

export default defineConfig({
  presets: [jaciPreset],
});
```

The preset shares tokens and conditions; `jaci-ui/styles.css` remains the distribution stylesheet
for the component recipes.

## Public entry points

- `jaci-ui`: React components and named component types.
- `jaci-ui/styles.css`: generated static styles and semantic tokens.
- `jaci-ui/panda-preset`: optional Panda CSS preset.

## Development

This repository uses pnpm, Turborepo, Panda CSS and Storybook. From the repository root:

```sh
pnpm install
pnpm storybook
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm package:check
```
