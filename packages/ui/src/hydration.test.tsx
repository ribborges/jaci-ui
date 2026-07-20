// @vitest-environment jsdom

import { act } from "react";
import type { Root } from "react-dom/client";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  Avatar,
  Checkbox,
  CheckboxGroup,
  Command,
  Combobox,
  ColorPicker,
  Copyable,
  DataView as JaciDataView,
  ContextMenu,
  DatePicker,
  Drawer,
  Field,
  FieldError,
  FieldLabel,
  Fieldset,
  Form,
  Heading,
  NumberField,
  Menubar,
  Meter,
  List,
  NavigationMenu,
  Pagination,
  OptionSelector,
  Popover,
  RadioGroup,
  RangeSlider,
  Slider,
  Stack,
  Switch,
  Table,
  TagsInput,
  Toggle,
  ToggleGroup,
  Toolbar,
  ScrollArea,
  Tooltip,
  Upload,
  TreeView,
  VisuallyHidden,
} from "./index";

const reactTestEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
const roots: Root[] = [];
let previousActEnvironment: boolean | undefined;

function HydrationFixture() {
  return (
    <Stack data-jaci-theme="light" gap="md">
      <Heading as="h1">Jaci UI</Heading>
      <Switch aria-label="Enable notifications" defaultChecked={false} />
      <Table.Root aria-label="Hydrated members">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Jaci</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <List.Root>
        <List.Item>Hydrated list item</List.Item>
      </List.Root>
      <JaciDataView.Root>
        <JaciDataView.Content>Hydrated data</JaciDataView.Content>
      </JaciDataView.Root>
      <ColorPicker.Root defaultValue="#2563eb">
        <ColorPicker.Trigger>
          <ColorPicker.Preview />
        </ColorPicker.Trigger>
      </ColorPicker.Root>
      <TagsInput data={["React", "TypeScript"]} defaultTags={["React"]} label="Tags" />
    </Stack>
  );
}

function InteractionHydrationFixture() {
  return (
    <Stack data-jaci-theme="light" gap="md">
      <Toggle defaultPressed>Preview</Toggle>
      <ToggleGroup.Root defaultValue={["grid"]} aria-label="View options">
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      </ToggleGroup.Root>
      <Toolbar.Root aria-label="Editor actions">
        <Toolbar.Group>
          <Toolbar.Button>Bold</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Input aria-label="Search" />
        <Toolbar.Link href="/docs">Docs</Toolbar.Link>
      </Toolbar.Root>
      <ScrollArea.Root style={{ height: "10rem" }}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>Scrollable content</ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <Copyable.Root value="pnpm add jaci-ui">
        <Copyable.Content>pnpm add jaci-ui</Copyable.Content>
        <Copyable.Indicator />
      </Copyable.Root>
    </Stack>
  );
}

function NavigationAndDataHydrationFixture() {
  return (
    <Stack data-jaci-theme="light" gap="md">
      <RangeSlider.Root defaultValue={[20, 80]} aria-label="Price range">
        <RangeSlider.Track>
          <RangeSlider.Indicator />
          <RangeSlider.Thumb index={0} aria-label="Minimum" />
          <RangeSlider.Thumb index={1} aria-label="Maximum" />
        </RangeSlider.Track>
      </RangeSlider.Root>
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="docs">
            <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <Meter.Root value={72} aria-label="Storage">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Command.Root>
        <Command.Input aria-label="Commands" />
        <Command.List>
          <Command.Item value="build">Build</Command.Item>
        </Command.List>
      </Command.Root>
      <TreeView.Root aria-label="Files">
        <TreeView.Item id="src">
          <TreeView.Toggle aria-label="Toggle src" />
          <TreeView.Label>src</TreeView.Label>
        </TreeView.Item>
      </TreeView.Root>
    </Stack>
  );
}

function OverlayHydrationFixture() {
  return (
    <Stack gap="md">
      <Avatar.Root aria-label="Jaci UI">
        <Avatar.Fallback>JU</Avatar.Fallback>
      </Avatar.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>More information</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" sideOffset={8}>
            <Tooltip.Popup>
              Helpful context
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Popover.Root>
        <Popover.Trigger>Open details</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner align="start" side="bottom" sideOffset={8}>
            <Popover.Popup>
              <Popover.Title>Details</Popover.Title>
              <Popover.Description>Hydrated client overlay.</Popover.Description>
              <Popover.Close />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <AlertDialog.Root>
        <AlertDialog.Trigger>Delete item</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Viewport>
            <AlertDialog.Popup>
              <AlertDialog.Title>Delete item?</AlertDialog.Title>
              <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
              <AlertDialog.Action>Delete</AlertDialog.Action>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      <Drawer.Root side="right">
        <Drawer.Trigger>Open details</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup>
              <Drawer.Title>Details</Drawer.Title>
              <Drawer.Content>Drawer content</Drawer.Content>
              <Drawer.Close />
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger>Open context menu</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item>Copy</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup>
                <Menubar.Item>New project</Menubar.Item>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>
    </Stack>
  );
}

function DateAndUploadHydrationFixture() {
  return (
    <Stack gap="md">
      <DatePicker.Root
        defaultValue={new Date(2025, 3, 15, 12, 0, 0, 0)}
        maxDate={new Date(2025, 3, 30, 12, 0, 0, 0)}
        minDate={new Date(2025, 3, 7, 12, 0, 0, 0)}
        name="release-date"
        open
      >
        <DatePicker.Label>Release date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Trigger>
            <DatePicker.Value />
          </DatePicker.Trigger>
          <DatePicker.Clear />
        </DatePicker.Control>
        <DatePicker.Header>
          <DatePicker.Previous />
          <DatePicker.Caption />
          <DatePicker.Next />
        </DatePicker.Header>
        <DatePicker.Calendar />
        <DatePicker.Portal keepMounted>
          <DatePicker.Positioner>
            <DatePicker.Popup>
              <DatePicker.Header>
                <DatePicker.Previous />
                <DatePicker.Caption />
                <DatePicker.Next />
              </DatePicker.Header>
              <DatePicker.Calendar />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>
      <Upload.Root accept="image/*" multiple>
        <Upload.Dropzone aria-label="Upload images">
          <Upload.Input />
          <Upload.Text>Choose images</Upload.Text>
        </Upload.Dropzone>
        <Upload.Progress label="32% uploaded" value={32} />
        <Upload.List />
      </Upload.Root>
    </Stack>
  );
}

function OptionSelectorHydrationFixture() {
  return (
    <OptionSelector
      defaultValue={["pro"]}
      label="Workspace plan"
      multiple
      name="plan"
      options={[
        { children: <span aria-hidden="true">◈</span>, label: "Starter", value: "starter" },
        { children: <span aria-hidden="true">◆</span>, label: "Pro", value: "pro" },
      ]}
    />
  );
}

function FormHydrationFixture() {
  return (
    <Form errors={{ email: "Email is already in use." }} onFormSubmit={() => undefined}>
      <Fieldset.Root>
        <Fieldset.Legend>Account</Fieldset.Legend>
        <Field name="email">
          <FieldLabel htmlFor="hydration-email">Email</FieldLabel>
          <input id="hydration-email" name="email" required type="email" />
          <FieldError />
        </Field>
      </Fieldset.Root>
      <VisuallyHidden>Form status</VisuallyHidden>
    </Form>
  );
}

function SelectionHydrationFixture() {
  return (
    <Stack gap="md">
      <Combobox.Root items={["React", "Vite"]} name="framework">
        <Combobox.Label>Framework</Combobox.Label>
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Search" />
          <Combobox.Trigger aria-label="Open frameworks">
            <Combobox.Icon />
          </Combobox.Trigger>
        </Combobox.InputGroup>
      </Combobox.Root>
      <RadioGroup.Root defaultValue="pro" name="plan">
        <RadioGroup.Label>Plan</RadioGroup.Label>
        <RadioGroup.Options>
          <RadioGroup.Option>
            <RadioGroup.Item value="pro">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            Pro
          </RadioGroup.Option>
        </RadioGroup.Options>
      </RadioGroup.Root>
      <CheckboxGroup.Root defaultValue={["typescript"]} name="skills">
        <CheckboxGroup.Label>Skills</CheckboxGroup.Label>
        <CheckboxGroup.Options>
          <CheckboxGroup.Option>
            <CheckboxGroup.Item value="typescript">
              <CheckboxGroup.Indicator />
            </CheckboxGroup.Item>
            TypeScript
          </CheckboxGroup.Option>
        </CheckboxGroup.Options>
      </CheckboxGroup.Root>
      <Slider.Root defaultValue={40} max={100} min={0} name="volume">
        <Slider.Label>Volume</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Volume" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
      <NumberField.Root defaultValue={2} max={10} min={0} name="seats">
        <NumberField.Label>Seats</NumberField.Label>
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input aria-label="Seats" />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField.Root>
      <Checkbox defaultChecked={false} id="hydrated-updates" name="updates" />
    </Stack>
  );
}

beforeAll(() => {
  previousActEnvironment = reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT;
  reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  for (const root of roots.splice(0)) {
    act(() => root.unmount());
  }

  document.body.replaceChildren();
});

afterAll(() => {
  if (previousActEnvironment === undefined) {
    delete reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT;
  } else {
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
});

describe("SSR hydration", () => {
  it("hydrates navigation and data primitives without recoverable errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<NavigationAndDataHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <NavigationAndDataHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) roots.push(root);
    expect(container.querySelector('[data-jaci-component="range-slider"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="navigation-menu"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="meter"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="command"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="tree-view"]')).not.toBeNull();
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("hydrates interaction primitives without recoverable errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<InteractionHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <InteractionHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    expect(container.querySelector('[data-jaci-component="toggle"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="toggle-group"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="toolbar"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="scroll-area"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="copyable"]')).not.toBeNull();
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("hydrates static and interactive components without recoverable errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<HydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;

    await act(async () => {
      root = hydrateRoot(container, <HydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    expect(container.querySelector("h1")?.textContent).toBe("Jaci UI");
    expect(container.querySelector('[data-slot="table-cell"]')?.textContent).toBe("Jaci");
    expect(container.querySelector('[data-jaci-component="list"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="data-view"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="color-picker-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="tags-input"]')).not.toBeNull();
    expect(onRecoverableError).not.toHaveBeenCalled();

    const toggle = container.querySelector<HTMLButtonElement>('[data-jaci-component="switch"]');
    if (!toggle) {
      throw new Error("The hydrated switch was not rendered.");
    }

    expect(toggle.getAttribute("aria-checked")).toBe("false");

    await act(async () => {
      toggle?.click();
    });

    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("hydrates Avatar and Base UI overlay triggers without recoverable errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<OverlayHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;

    await act(async () => {
      root = hydrateRoot(container, <OverlayHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    expect(container.querySelector('[data-jaci-component="avatar"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="tooltip-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="popover-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="alert-dialog-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="drawer-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="context-menu-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="menubar-trigger"]')).not.toBeNull();
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("keeps disabled pagination links out of the interaction path", async () => {
    const onClick = vi.fn();
    const fixture = (
      <Pagination.Root>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Previous disabled href="#previous" onClick={onClick} />
          </Pagination.Item>
        </Pagination.List>
      </Pagination.Root>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(fixture);
    document.body.append(container);

    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, fixture);
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    const previous = container.querySelector<HTMLAnchorElement>(
      '[data-slot="pagination-previous"]',
    );
    if (!previous) {
      throw new Error("The disabled pagination link was not rendered.");
    }

    expect(previous.getAttribute("aria-disabled")).toBe("true");
    expect(previous.hasAttribute("href")).toBe(false);
    expect(previous.tabIndex).toBe(-1);

    await act(async () => {
      previous.click();
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it("hydrates DatePicker and Upload without recoverable errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<DateAndUploadHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <DateAndUploadHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    expect(container.querySelector('[data-slot="date-picker-trigger"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="date-picker-previous"]:disabled')).not.toBeNull();
    expect(container.querySelector('[data-slot="date-picker-next"]:disabled')).not.toBeNull();
    expect(container.querySelector('[data-slot="upload-dropzone"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="upload-progress"]')?.getAttribute("aria-valuenow"),
    ).toBe("32");
    expect(container.querySelector('input[type="file"]')).not.toBeNull();
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("accepts and removes a file through the Upload input", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<DateAndUploadHydrationFixture />);
    document.body.append(container);

    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <DateAndUploadHydrationFixture />);
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) {
      throw new Error("The Upload file input was not rendered.");
    }

    const file = new File(["image"], "avatar.png", { type: "image/png" });
    const fileList = {
      0: file,
      item: (index: number) => (index === 0 ? file : null),
      length: 1,
    } as unknown as FileList;
    Object.defineProperty(input, "files", { configurable: true, value: fileList });

    await act(async () => {
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(container.querySelector('[data-slot="upload-item-name"]')?.textContent).toBe(
      "avatar.png",
    );

    const remove = container.querySelector<HTMLButtonElement>('[data-slot="upload-remove"]');
    if (!remove) {
      throw new Error("The Upload remove button was not rendered.");
    }

    await act(async () => {
      remove.click();
    });

    expect(container.querySelector('[data-slot="upload-item-name"]')).toBeNull();
  });

  it("hydrates OptionSelector and changes multiple native options", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<OptionSelectorHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <OptionSelectorHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    const starter = container.querySelector<HTMLInputElement>('input[value="starter"]');
    const pro = container.querySelector<HTMLInputElement>('input[value="pro"]');
    if (!starter || !pro) {
      throw new Error("The hydrated OptionSelector options were not rendered.");
    }

    expect(pro.checked).toBe(true);
    expect(starter.checked).toBe(false);

    await act(async () => {
      starter.click();
    });

    expect(starter.checked).toBe(true);
    expect(pro.checked).toBe(true);
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("hydrates Form, Fieldset and external Field errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<FormHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <FormHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    expect(container.querySelector('[data-jaci-component="form"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="fieldset"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="field-error"]')?.textContent).toContain(
      "Email is already in use.",
    );
    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("hydrates Combobox and RadioGroup without recoverable errors", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<SelectionHydrationFixture />);
    document.body.append(container);

    const onRecoverableError = vi.fn();
    let root: Root | undefined;
    await act(async () => {
      root = hydrateRoot(container, <SelectionHydrationFixture />, { onRecoverableError });
    });

    expect(root).toBeDefined();
    if (root) {
      roots.push(root);
    }

    expect(container.querySelector('[data-slot="combobox-input"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="radio-group-item"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="slider-thumb"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="number-field-input"]')).not.toBeNull();
    expect(container.querySelector('[data-jaci-component="checkbox"]')).not.toBeNull();
    expect(onRecoverableError).not.toHaveBeenCalled();
  });
});
