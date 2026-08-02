# Changelog

## 0.9.4

### Patch Changes

- b6389ad: Allow Badge custom tones to be styled with consumer CSS classes while preserving semantic theme tones.
- fec5db2: Restore subtle light elevation shadows for raised components in dark themes.

## 0.9.3

### Patch Changes

- caa17c1: Allow Button links composed with `render={<a />}` to render safely from Next.js server components.
- 3efbbee: Keep Accordion roots at a stable responsive width when all panels are collapsed.

## 0.9.2

### Patch Changes

- 894b4e8: Update Storybook and compatible workspace tooling dependencies to their latest patch releases.
- 10446a3: Fix `Button.render` with native and framework link elements, including Next.js client boundaries.
- cdcfb85: Improve QRCode finder contrast in dark themes and add native SVG download support.
- 77a1b9f: Improve QRCode's native SVG download link accessibility and preserve the QR code's image semantics.

## 0.9.1

### Patch Changes

- 8588c34: Fix production backdrop blur declarations and restore blur in the Command dropdown.

## 0.9.0

### Minor Changes

- d06e214: Add Carousel, ColorSwatch, DownloadTrigger, QRCode and Spacer components, and consolidate the Separator utilities.

## 0.8.0

### Minor Changes

- cd7966c: Harden package compatibility, tarball validation, tree-shaking and CI coverage for React and framework consumers.

## 0.7.0

### Minor Changes

- fb498f5: Add Code, Kbd, AspectRatio, Image, Figure and Stat/StatGroup, with configurable image lightboxes and expanded content, feedback, card and typography APIs.

## 0.6.3

### Patch Changes

- 8d9f4cb: Preserve the Navbar blur in Next.js by emitting a browser-safe CSS declaration for the bar surface.

## 0.6.2

### Patch Changes

- 513422d: Ensure the Navbar blur is preserved when the package stylesheet is consumed by Next.js and improve its Storybook controls and usage examples.

## 0.6.1

### Patch Changes

- 06fa9ee: Make the compound `Navbar` namespace compatible with Next.js App Router Server Components.

## 0.6.0

### Minor Changes

- 165083c: Improve navigation and overlay dismissal, focus, scroll-lock and responsive behavior, and add the accessible controlled `Stepper` component.

## 0.5.0

### Minor Changes

- 343c729: Add controlled data-display primitives for tables, views, lists and pagination, plus the new
  DataToolbar composition. Command and TreeView gain more robust filtering, selection, keyboard
  navigation and declarative loading states.

## 0.4.0

### Minor Changes

- bd92571: Add Calendar, DateRangePicker, and PinInput components, plus richer form field, input, tags, upload, and selection APIs.

## 0.3.0

### Minor Changes

- 60fe9f1: Add the optional ThemeProvider and reusable IconButton, ButtonGroup, InputGroup, and EmptyState components.

## 0.2.0

### Minor Changes

- 3e3e82c: Add blurred input popups, draggable ColorPicker palette selection, and month/date-time DatePicker modes.

## 0.1.1

### Patch Changes

- b8dce0e: Prepare the package for its next patch release with distributable documentation, reproducible consumer fixtures, expanded accessibility coverage, and release workflow improvements.

All notable changes to `jaci-ui` are documented in this file. Release entries are generated and
updated by Changesets.

## 0.1.0 — Initial public release

- Initial public Jaci UI component library.
- Static Panda CSS distribution at `jaci-ui/styles.css`.
- Optional Panda preset at `jaci-ui/panda-preset`.
- SSR-safe static and interactive React component families.
