# Jaci UI

Accessible, themeable React components for React 18.2 and React 19 applications.

The published package supports Node 18.18 or newer. Node 22.18 or newer is required only for
working on the repository because it is used by the build toolchain.

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

The package publishes ESM and CommonJS entry points, TypeScript declarations and sourcemaps.
`jaci-ui/styles.css` is the only declared side effect, so bundlers can tree-shake unused
component modules. Import `jaci-ui/panda-preset` only when an application also uses Panda CSS;
the regular package does not require Panda at runtime.

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

Content and visual utilities are framework-agnostic and server-safe where possible:

```tsx
import { AspectRatio, Code, Figure, Image, Kbd, Quote, Stat, StatGroup } from "jaci-ui";

<Code variant="block" language="tsx">const value = 42;</Code>;
<Kbd>⌘K</Kbd>;
<Quote author="Alan Kay" source="Alan Kay">The best way to predict the future is to invent it.</Quote>;
<AspectRatio ratio={16 / 9}><Image src="/cover.jpg" alt="Cover" fit="cover" /></AspectRatio>;
<Figure.Root lightbox>
  <Figure.Image src="/cover.jpg" alt="Cover" />
  <Figure.Caption>Project cover</Figure.Caption>
</Figure.Root>;
<StatGroup.Root columns={3}>
  <Stat.Root tone="success">
    <Stat.Label>Revenue</Stat.Label>
    <Stat.Value>$12.4k</Stat.Value>
    <Stat.Trend direction="up">+18%</Stat.Trend>
  </Stat.Root>
</StatGroup.Root>;
```

### Mídia e utilitários visuais

`Carousel` oferece slides acessíveis com navegação por teclado, indicadores, swipe e autoplay
opcional. Sempre forneça um `aria-label` no root e texto alternativo nas imagens:

```tsx
<Carousel.Root aria-label="Featured projects" loop>
  <Carousel.Viewport>
    <Carousel.Track>
      <Carousel.Item index={0}>
        <Carousel.Media><Image src="/project.jpg" alt="Project preview" /></Carousel.Media>
        <Carousel.Caption>
          <Carousel.Title>Project title</Carousel.Title>
          <Carousel.Description>Project description</Carousel.Description>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel.Root>
```

`QRCode` gera SVG no servidor e no cliente, com módulos circulares e olhos quadrados
arredondados. O valor pode ser controlado diretamente pela aplicação:

```tsx
<QRCode
  value="https://jaci-ui.dev"
  size={240}
  errorCorrectionLevel="Q"
  label="Jaci UI website"
  download="jaci-ui-qr.svg"
  downloadLabel="Download Jaci UI QR code"
/>
```

Quando `download` é informado, o SVG expõe um link nativo para baixar o código sem usar APIs
do navegador durante SSR.

Para downloads, `DownloadTrigger` é um link HTML comum e não faz fetch nem cria `Blob`:

```tsx
<DownloadTrigger href="/files/report.pdf" download="report.pdf">
  Download report
</DownloadTrigger>
```

Em URLs cross-origin, o nome e a própria autorização do download continuam sujeitos às regras
do navegador e aos headers do servidor.

Use `Separator` para uma linha semântica ou decorativa entre seções e `Spacer` quando precisar
apenas de espaço, sem linha:

```tsx
<Separator orientation="horizontal" />
<Spacer axis="vertical" size="lg" />
```

Todos esses componentes continuam compatíveis com SSR e React 18/19. `Carousel` é o único novo
módulo interativo; os demais não acessam APIs do navegador durante importação ou renderização.

`AspectRatio` fills the available inline size of its parent. In shrink-to-fit or flex
layouts, give the parent an explicit `width`/`max-width` so the ratio has a measurable
size.

`Code` is intentionally presentation-only; compose it with `Copyable` when users should be able
to copy a command. `Image` uses the native `<img>` element, accepts a React fallback and can opt
into a focusable blurred lightbox with `lightbox`. `Figure` adds a semantic caption that remains
visible in the expanded image preview, without requiring a framework-specific image optimizer.

Interactive components support controlled and uncontrolled state where appropriate. For example,
`value`/`onValueChange` can be paired with `defaultValue` when the application does not need to
own the state. `ColorPicker.Palette` supports pointer dragging, keyboard arrows and a visible
selection indicator.

DatePicker supports day, month and date-time values while keeping the public value as a native
`Date`. Add the month and year selectors to the header for quick navigation, and use
`DatePicker.TimeField` for the date-time mode:

```tsx
<DatePicker.Root granularity="date-time" defaultValue={new Date()} name="meeting-at">
  <DatePicker.Trigger><DatePicker.Value /></DatePicker.Trigger>
  <DatePicker.Portal>
    <DatePicker.Positioner>
      <DatePicker.Popup>
        <DatePicker.Header>
          <DatePicker.Previous />
          <DatePicker.MonthSelect />
          <DatePicker.YearSelect />
          <DatePicker.Next />
        </DatePicker.Header>
        <DatePicker.Calendar />
        <DatePicker.TimeField />
        <DatePicker.Close>Done</DatePicker.Close>
      </DatePicker.Popup>
    </DatePicker.Positioner>
  </DatePicker.Portal>
</DatePicker.Root>
```

Use `granularity="month"` to select a month normalized to its first day. Date-time popups stay
open until `DatePicker.Close` is activated; day and month modes close after selection by default.

`Calendar` is the standalone, server-renderable calendar engine. Pass `referenceDate` when the
initial view must be deterministic during SSR or tests:

```tsx
<Calendar.Root
  defaultValue={new Date(2025, 3, 15, 12)}
  referenceDate={new Date(2025, 3, 1, 12)}
  locale="en-US"
>
  <Calendar.Header>
    <Calendar.Previous />
    <Calendar.MonthSelect />
    <Calendar.YearSelect />
    <Calendar.Next />
  </Calendar.Header>
  <Calendar.Grid />
</Calendar.Root>
```

`DateRangePicker` keeps its value as local `Date` objects and supports native form fields,
previewing and optional closing after the second date:

```tsx
<DateRangePicker.Root name="period" closeOnSelect={false} referenceDate={new Date(2025, 3, 1, 12)}>
  <DateRangePicker.Label>Period</DateRangePicker.Label>
  <DateRangePicker.Trigger><DateRangePicker.Value /></DateRangePicker.Trigger>
  <DateRangePicker.Portal>
    <DateRangePicker.Positioner>
      <DateRangePicker.Popup>
        <DateRangePicker.Calendar />
        <DateRangePicker.Preview />
        <DateRangePicker.Close>Done</DateRangePicker.Close>
      </DateRangePicker.Popup>
    </DateRangePicker.Positioner>
  </DateRangePicker.Portal>
</DateRangePicker.Root>
```

For one-time codes, `PinInput` generates one accessible input per character and supports paste,
auto-advance, password masking and native form submission:

```tsx
<PinInput.Root length={6} name="verification-code" otp onComplete={verifyCode}>
  <PinInput.Label>Verification code</PinInput.Label>
  <PinInput.Control><PinInput.Inputs /></PinInput.Control>
</PinInput.Root>
```

For data-heavy screens, compose `DataToolbar`, `DataView`, `Table` and `Pagination` explicitly.
The library does not fetch, filter or virtualize data for you, so the application remains the
source of truth for query, sort, selection and page state:

```tsx
<DataToolbar.Root aria-label="Project tools">
  <DataToolbar.Search value={search} onValueChange={setSearch} />
  <DataToolbar.Sort value={sort} onValueChange={setSort}>
    <option value="name">Name</option>
  </DataToolbar.Sort>
  <DataToolbar.Selection count={selected.length} onClear={() => setSelected([])}>
    <DataToolbar.ClearSelection />
  </DataToolbar.Selection>
</DataToolbar.Root>

<DataView.Root layout="table" status={loading ? "loading" : "ready"}>
  <DataView.Content>
    <Table.Root
      selectionMode="multiple"
      selectedRowIds={selected}
      onSelectionChange={setSelected}
    >
      <Table.Header>{/* Table.Row, Table.SelectionHeader and Table.Head */}</Table.Header>
      <Table.Body>{/* Table.Row and Table.Cell */}</Table.Body>
    </Table.Root>
  </DataView.Content>
  <DataView.Footer>
    <Pagination.Root page={page} pageCount={pageCount} onPageChange={setPage} />
  </DataView.Footer>
</DataView.Root>
```

`Table` supports controlled sorting (`sort`/`onSortChange`), single or multiple selection,
disabled rows, loading/empty/error states, compact density, alignment and responsive columns.
`List` remains a semantic `ul`/`ol`, and `Command` and `TreeView` expose their keyboard and
selection state without requiring a data engine.

Navigation overlays keep focus and dismissal behavior in the Base UI primitive. Dialog-like
surfaces lock page scroll, restore focus to their trigger, and close with Escape or an outside
press by default. Popovers and menus stay within the viewport and accept the native Base UI
`initialFocus`, `finalFocus`, `modal` and `disablePointerDismissal` options.

Use `Stepper` for linear or freely navigable workflows. Its public value is a string and it can
submit the current step through a native hidden field:

```tsx
<Stepper.Root value={step} onValueChange={setStep} linear name="checkout-step">
  <Stepper.List>
    <Stepper.Item value="account">
      <Stepper.Trigger>
        <Stepper.Indicator />
        <Stepper.Title>Account</Stepper.Title>
      </Stepper.Trigger>
      <Stepper.Content>Profile details</Stepper.Content>
    </Stepper.Item>
    <Stepper.Item value="payment">
      <Stepper.Trigger>
        <Stepper.Indicator />
        <Stepper.Title>Payment</Stepper.Title>
      </Stepper.Trigger>
      <Stepper.Content>Billing information</Stepper.Content>
    </Stepper.Item>
  </Stepper.List>
  <Stepper.Previous />
  <Stepper.Next />
</Stepper.Root>
```

Small composition helpers keep common layouts consistent:

```tsx
import { Button, ButtonGroup, EmptyState, IconButton, Input, InputGroup } from "jaci-ui";

<IconButton aria-label="Close">×</IconButton>;
<ButtonGroup><Button>Save</Button><Button>Cancel</Button></ButtonGroup>;
<InputGroup><InputGroup.Addon>https://</InputGroup.Addon><Input aria-label="URL" /></InputGroup>;
<EmptyState.Root><EmptyState.Title>No results</EmptyState.Title></EmptyState.Root>;
```

`IconButton` requires an accessible label for icon-only content. `ButtonGroup` and `InputGroup`
also expose `.Root` aliases for compound composition.

## Server rendering and frameworks

Static components are server-safe and interactive modules preserve their `"use client"` boundary.
In Next.js App Router, import the global stylesheet from `app/layout.tsx`:

```tsx
// app/layout.tsx
import "jaci-ui/styles.css";
```

The compound `Navbar` namespace is safe to use directly from a Server Component; controlled
navigation state and event handlers should live in a client component as usual:

```tsx
import { Navbar } from "jaci-ui";

export default function Page() {
  return (
    <Navbar.Root>
      <Navbar.Bar aria-label="Primary navigation">
        <Navbar.Item href="/docs">Documentation</Navbar.Item>
      </Navbar.Bar>
    </Navbar.Root>
  );
}
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

For applications that prefer a React API, `ThemeProvider` is optional. It can control the mode
and apply token overrides to only its subtree:

```tsx
import { ThemeProvider, useTheme } from "jaci-ui";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>Toggle</button>;
}

export function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      ssrTheme="light"
      tokens={{
        colors: {
          accent: { default: "#7c3aed", hover: "#6d28d9" },
          fg: { onAccent: "#ffffff" },
        },
      }}
    >
      <ThemeToggle />
    </ThemeProvider>
  );
}
```

`system` uses `ssrTheme` during server rendering and reads `prefers-color-scheme` only after
mounting. The provider is a client module, so Next.js App Router applications should place it
inside a client boundary. Direct `data-jaci-theme` and `--jaci-*` variables remain supported.

Popups rendered through Jaci portal slots inherit the nearest `ThemeProvider` scope, including
local accent tokens. An explicit `container` prop on a portal still takes precedence. Without a
provider, portals keep Base UI's default document-level behavior.

When combining responsive utility classes with `Sidebar` or `BottomNavigation`, import
`jaci-ui/styles.css` before the application's utility stylesheet. Their structural display rule
uses a low-specificity selector, so classes such as `hidden md:flex` and `md:hidden` can control
visibility without inline styles.

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

The public API contract is generated from the package entrypoint and declaration files. Run
`pnpm api:contract` from the workspace to detect unreviewed changes to exports, callbacks,
compound slots, aliases and client boundaries.

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
