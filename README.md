# Jaci UI

Jaci UI is an accessible React component library with a neutral default visual language,
Panda CSS tokens, static CSS distribution, and SSR-safe components.

## Packages

- jaci-ui: React components.
- jaci-ui/styles.css: generated default styles.
- jaci-ui/panda-preset: optional Panda CSS tokens and conditions.

## Local development

Use Node 22.14 or newer, then install dependencies:

```sh
corepack enable
pnpm install
```

### Visual component testing

Run the full component catalog in Storybook:

```sh
pnpm storybook
```

Open http://localhost:6006. The toolbar switches between the light and dark themes, and each
story documents variants, focus states, invalid form states, and responsive layouts.

For a small application-level consumer test, run the Vite fixture:

```sh
pnpm --filter @jaci-ui/fixture-vite dev
```

Open the URL printed by Vite (normally http://localhost:5173). To validate a Next app manually,
run `pnpm --filter @jaci-ui/fixture-next dev`; its production build is also exercised by the
workspace checks. The React Router SSR smoke test is available through
`pnpm --filter @jaci-ui/fixture-react-router check`.

In Next App Router Server Components, use the named primitive exports when rendering an
interactive trigger (`AlertDialogRoot`/`AlertDialogTrigger`, `DrawerRoot`/`DrawerTrigger`). Keep
the compound `AlertDialog.Root` and `Drawer.Root` compositions inside a `"use client"` component;
this preserves the RSC client-reference boundary while keeping the same API in client apps.

### Automated checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm fixtures:check
```

`pnpm storybook:build` verifies the documentation build, while `pnpm package:check` validates
the package exports and types. `pnpm fixtures:pack-check` installs the real packed tarball in
the Vite, Next, and React Router consumer fixtures.

Run `pnpm dev` to watch all available development targets together.
