import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AlertDialog,
  Alert,
  Avatar,
  Badge,
  BottomNavigation,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Combobox,
  Collapsible,
  Command,
  ContextMenu,
  ColorPicker,
  Copyable,
  DataToolbar,
  DataView as JaciDataView,
  DatePicker,
  Dialog,
  Drawer,
  Field,
  FieldError,
  FieldLabel,
  Fieldset,
  Form,
  Heading,
  Input,
  Menu,
  Menubar,
  Meter,
  List,
  Navbar,
  NavigationMenu,
  NumberField,
  OptionSelector,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  RangeSlider,
  Select,
  Sidebar,
  Skeleton,
  Slider,
  Stack,
  Table,
  TagsInput,
  Tabs,
  Toggle,
  ToggleGroup,
  Toolbar,
  ScrollArea,
  Text,
  Toast,
  Tooltip,
  Upload,
  TreeView,
  VisuallyHidden,
  Switch,
} from "./index";

describe("SSR rendering", () => {
  it("renders static and interactive components deterministically on the server", () => {
    const html = renderToString(
      <Stack data-jaci-theme="light">
        <Heading as="h1">Jaci UI</Heading>
        <Text>SSR-safe content</Text>
        <Badge tone="accent">New</Badge>
        <Card>
          <Button>Save</Button>
          <Input aria-label="Name" defaultValue="Jaci" />
        </Card>
      </Stack>,
    );

    expect(html).toContain("Jaci UI");
    expect(html).toContain('data-jaci-component="button"');
    expect(html).toContain('data-jaci-component="input"');
  });

  it("renders interaction primitives without browser globals on the server", () => {
    const html = renderToString(
      <>
        <Toggle defaultPressed>Preview</Toggle>
        <ToggleGroup.Root defaultValue={["grid"]} aria-label="View">
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
        <ScrollArea.Root>
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
      </>,
    );

    expect(html).toContain('data-jaci-component="toggle"');
    expect(html).toContain('data-jaci-component="toggle-group"');
    expect(html).toContain('data-jaci-component="toolbar"');
    expect(html).toContain('data-jaci-component="scroll-area"');
    expect(html).toContain('data-jaci-component="copyable"');
    expect(html).toContain("pnpm add jaci-ui");
  });

  it("renders navigation and data primitives without browser globals on the server", () => {
    const html = renderToString(
      <>
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
              <NavigationMenu.Content keepMounted>Documentation</NavigationMenu.Content>
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
            <TreeView.Group>
              <TreeView.Item id="index">
                <TreeView.Label>index.ts</TreeView.Label>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
        </TreeView.Root>
      </>,
    );

    expect(html).toContain('data-jaci-component="range-slider"');
    expect(html).toContain('data-jaci-component="navigation-menu"');
    expect(html).toContain('data-jaci-component="meter"');
    expect(html).toContain('data-jaci-component="command"');
    expect(html).toContain('data-jaci-component="tree-view"');
    expect(html).toContain("Documentation");
  });

  it("renders data display primitives and a closed color picker safely on the server", () => {
    const html = renderToString(
      <>
        <Table.Container>
          <Table.Root>
            <Table.Caption>Members</Table.Caption>
            <Table.Header>
              <Table.Row id="ssr-header-row">
                <Table.Head>Name</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row id="ssr-body-row">
                <Table.Cell>Jaci</Table.Cell>
              </Table.Row>
              <Table.Empty colSpan={1} />
            </Table.Body>
          </Table.Root>
        </Table.Container>
        <List.Root>
          <List.Item>
            <List.ItemContent>
              <List.ItemTitle>Design system</List.ItemTitle>
            </List.ItemContent>
          </List.Item>
        </List.Root>
        <JaciDataView.Root layout="grid" columns={2}>
          <JaciDataView.Content>Cards</JaciDataView.Content>
          <JaciDataView.Empty>No cards</JaciDataView.Empty>
        </JaciDataView.Root>
        <DataToolbar.Root aria-label="Data tools">
          <DataToolbar.Search aria-label="Search data" />
          <DataToolbar.Sort aria-label="Sort data">
            <option value="name">Name</option>
          </DataToolbar.Sort>
        </DataToolbar.Root>
        <Pagination.Root pageCount={3} defaultPage={2} />
        <ColorPicker.Root defaultValue="#2563eb">
          <ColorPicker.Label>Brand color</ColorPicker.Label>
          <ColorPicker.Trigger>
            <ColorPicker.Preview />
            <ColorPicker.Value />
          </ColorPicker.Trigger>
        </ColorPicker.Root>
        <TagsInput data={["React", "TypeScript"]} defaultTags={["React"]} label="Tags" />
      </>,
    );

    expect(html).toContain('data-jaci-component="table"');
    expect(html).toContain('data-slot="table-cell"');
    expect(html).toContain('data-jaci-component="list"');
    expect(html).toContain('data-jaci-component="data-view"');
    expect(html).toContain('data-jaci-component="color-picker"');
    expect(html).toContain('data-jaci-component="tags-input"');
    expect(html).toContain("#2563eb");
  });

  it("renders Base UI disclosure primitives with their accessible relationships", () => {
    const html = renderToString(
      <>
        <Tabs.Root defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
          <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
        </Tabs.Root>

        <Accordion.Root defaultValue={["first"]}>
          <Accordion.Item value="first">
            <Accordion.Header>
              <Accordion.Trigger>First item</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>First panel</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>

        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger>More details</Collapsible.Trigger>
          <Collapsible.Panel>Additional content</Collapsible.Panel>
        </Collapsible.Root>
      </>,
    );

    expect(html).toContain('data-jaci-component="tabs"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('data-jaci-component="accordion"');
    expect(html).toContain('role="region"');
    expect(html).toContain('data-jaci-component="collapsible"');
  });

  it("renders the dialog composition safely on the server", () => {
    const html = renderToString(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>Open details</Dialog.Trigger>
        <Dialog.Portal keepMounted>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm">
              <Dialog.Header>
                <Dialog.Title>Dialog title</Dialog.Title>
                <Dialog.Close />
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>Dialog description</Dialog.Description>
              </Dialog.Body>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    // Portals intentionally render nothing on the server, but Base UI still
    // produces a hydrated trigger without accessing browser-only globals.
    expect(html).toContain('data-slot="dialog-trigger"');
    expect(html).toContain('aria-haspopup="dialog"');
  });

  it("renders a menu trigger safely on the server", () => {
    const html = renderToString(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Portal keepMounted>
          <Menu.Positioner sideOffset={8}>
            <Menu.Popup aria-label="Actions">
              <Menu.Group>
                <Menu.GroupLabel>Project</Menu.GroupLabel>
                <Menu.Item>Duplicate</Menu.Item>
              </Menu.Group>
              <Menu.Separator />
              <Menu.Item>Archive</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );

    // The portal intentionally does not emit its contents during SSR. The
    // trigger remains deterministic and is hydrated by Base UI on the client.
    expect(html).toContain('data-jaci-component="menu"');
    expect(html).toContain('data-slot="menu-trigger"');
    expect(html).toContain('aria-haspopup="menu"');
  });

  it("renders a select trigger safely on the server", () => {
    const html = renderToString(
      <Select.Root defaultValue="pro">
        <Select.Label>Plan</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Choose a plan" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner align="start" sideOffset={8}>
            <Select.Popup>
              <Select.List>
                <Select.Group>
                  <Select.GroupLabel>Plans</Select.GroupLabel>
                  <Select.Item value="starter">
                    <Select.ItemText>Starter</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                  <Select.Item value="pro">
                    <Select.ItemText>Pro</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                </Select.Group>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>,
    );

    // As with the other floating Base UI primitives, the portal is client
    // mounted. The labelled trigger remains deterministic for SSR.
    expect(html).toContain('data-jaci-component="select"');
    expect(html).toContain('data-slot="select-trigger"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain("Plan");
  });

  it("renders combobox and radio group controls safely on the server", () => {
    const html = renderToString(
      <>
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
      </>,
    );

    expect(html).toContain('data-slot="combobox-input"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('data-slot="radio-group-item"');
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('name="plan"');
    expect(html).toContain('data-slot="checkbox-group-item"');
    expect(html).toContain('role="group"');
  });

  it("renders numeric controls and Base UI form controls safely on the server", () => {
    const html = renderToString(
      <>
        <Slider.Root defaultValue={40} max={100} min={0} name="volume">
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
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
        <Checkbox defaultChecked id="updates" name="updates" />
        <Switch defaultChecked name="notifications" />
      </>,
    );

    expect(html).toContain('data-jaci-component="slider"');
    expect(html).toContain('data-slot="slider-thumb"');
    expect(html).toContain('data-jaci-component="number-field"');
    expect(html).toContain('data-slot="number-field-input"');
    expect(html).toContain('role="checkbox"');
    expect(html).toContain('role="switch"');
  });

  it("renders an expanded or collapsed sidebar composition safely on the server", () => {
    const html = renderToString(
      <Sidebar.Root defaultOpen={false} aria-label="Workspace">
        <Sidebar.Header>
          <Sidebar.Label>Jaci UI</Sidebar.Label>
        </Sidebar.Header>
        <Sidebar.Toggle />
        <Sidebar.Content aria-label="Workspace navigation">
          <Sidebar.Item active href="#overview">
            <span aria-hidden="true">⌂</span>
            <Sidebar.Label>Overview</Sidebar.Label>
          </Sidebar.Item>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Label>Signed in</Sidebar.Label>
        </Sidebar.Footer>
      </Sidebar.Root>,
    );

    expect(html).toContain('data-jaci-component="sidebar"');
    expect(html).toContain('data-state="closed"');
    expect(html).toContain('data-slot="sidebar-toggle"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-current="page"');
  });

  it("renders fixed navigation and its accessible mobile trigger safely on the server", () => {
    const html = renderToString(
      <>
        <Navbar.Root defaultOpen>
          <Navbar.Bar aria-label="Primary navigation">
            <Navbar.Start>
              <Navbar.Toggle />
              <Navbar.Item active href="#overview">
                Overview
              </Navbar.Item>
            </Navbar.Start>
            <Navbar.Center>Jaci UI</Navbar.Center>
            <Navbar.End>
              <Navbar.Item href="#account">Account</Navbar.Item>
            </Navbar.End>
          </Navbar.Bar>
          <Navbar.Drawer portalProps={{ keepMounted: true }}>
            <Navbar.Close />
            <Navbar.Item href="#projects">Projects</Navbar.Item>
          </Navbar.Drawer>
        </Navbar.Root>

        <BottomNavigation aria-label="Mobile navigation">
          <BottomNavigation.Item active href="#overview">
            Overview
          </BottomNavigation.Item>
          <BottomNavigation.Item href="#projects">Projects</BottomNavigation.Item>
        </BottomNavigation>
      </>,
    );

    expect(html).toContain('data-jaci-component="navbar"');
    expect(html).toContain('data-slot="navbar-toggle"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('data-jaci-component="bottom-navigation"');
    expect(html).toContain('data-slot="bottom-navigation-item"');
    expect(html).toContain('aria-current="page"');
  });

  it("renders a composed toast region safely on the server", () => {
    const html = renderToString(
      <Toast.Provider timeout={0}>
        <Toast.Viewport>
          <Toast.Root
            toast={{
              id: "release-saved",
              description: "Your changes are now available to collaborators.",
              title: "Project saved",
              type: "success",
            }}
          >
            <Toast.Content>
              <Toast.Text>
                <Toast.Title />
                <Toast.Description />
              </Toast.Text>
              <Toast.Action>Undo</Toast.Action>
              <Toast.Close />
            </Toast.Content>
          </Toast.Root>
        </Toast.Viewport>
      </Toast.Provider>,
    );

    expect(html).toContain('data-jaci-component="toast"');
    expect(html).toContain('data-jaci-tone="success"');
    expect(html).toContain("Project saved");
    expect(html).toContain('aria-label="Dismiss notification"');
  });

  it("renders feedback, identity and navigation primitives deterministically", () => {
    const html = renderToString(
      <Stack gap="lg">
        <Alert.Root tone="warning">
          <Alert.Icon />
          <Alert.Title>Action required</Alert.Title>
          <Alert.Description>Review the workspace access settings.</Alert.Description>
        </Alert.Root>
        <Progress label="Publishing release" max={8} value={6} />
        <Skeleton variant="text" />
        <Avatar.Root aria-label="Ada Lovelace" size="lg">
          <Avatar.Image alt="Ada Lovelace" src="/ada.png" />
          <Avatar.Fallback>AL</Avatar.Fallback>
        </Avatar.Root>
        <Breadcrumbs.Root>
          <Breadcrumbs.List>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#workspace">Workspace</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>
              <Breadcrumbs.Current>Settings</Breadcrumbs.Current>
            </Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs.Root>
        <Pagination.Root>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Previous href="#page-1" />
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Link active href="#page-2">
                2
              </Pagination.Link>
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
            <Pagination.Item>
              <Pagination.Next href="#page-3" />
            </Pagination.Item>
          </Pagination.List>
        </Pagination.Root>
      </Stack>,
    );

    expect(html).toContain('data-jaci-component="alert"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="6"');
    expect(html).toContain('data-jaci-component="skeleton"');
    expect(html).toContain('data-jaci-component="avatar"');
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('data-jaci-component="pagination"');
  });

  it("renders floating overlay triggers without browser globals", () => {
    const html = renderToString(
      <>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>More information</Tooltip.Trigger>
          <Tooltip.Portal keepMounted>
            <Tooltip.Positioner side="top" sideOffset={8}>
              <Tooltip.Popup>
                Helpful context
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Popover.Root defaultOpen>
          <Popover.Trigger>Open details</Popover.Trigger>
          <Popover.Portal keepMounted>
            <Popover.Positioner align="start" side="bottom" sideOffset={8}>
              <Popover.Popup>
                <Popover.Arrow />
                <Popover.Title>Details</Popover.Title>
                <Popover.Description>SSR-safe overlay composition.</Popover.Description>
                <Popover.Close />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </>,
    );

    expect(html).toContain('data-jaci-component="tooltip"');
    expect(html).toContain('data-slot="tooltip-trigger"');
    expect(html).toContain("data-base-ui-tooltip-trigger");
    expect(html).toContain('data-jaci-component="popover"');
    expect(html).toContain('data-slot="popover-trigger"');
    expect(html).toContain('aria-haspopup="dialog"');
  });

  it("renders AlertDialog and Drawer compositions without browser globals", () => {
    const html = renderToString(
      <>
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
      </>,
    );

    expect(html).toContain('data-slot="alert-dialog-trigger"');
    expect(html).toContain('data-slot="drawer-trigger"');
    expect(html).toContain('aria-haspopup="dialog"');
  });

  it("renders ContextMenu and Menubar navigation without browser globals", () => {
    const html = renderToString(
      <>
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
      </>,
    );

    expect(html).toContain('data-slot="context-menu-trigger"');
    expect(html).toContain('data-slot="menubar"');
    expect(html).toContain('data-slot="menubar-trigger"');
    expect(html).toContain('role="menubar"');
  });

  it("renders date and file controls deterministically on the server", () => {
    const html = renderToString(
      <Stack gap="lg">
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
          <Upload.Preview file={{ name: "avatar.png", type: "image/png" } as File} />
          <Upload.Progress label="68% uploaded" value={68} />
          <Upload.List />
        </Upload.Root>
      </Stack>,
    );

    expect(html).toContain('data-jaci-component="date-picker"');
    expect(html).toContain('data-slot="date-picker-trigger"');
    expect(html).toContain('name="release-date"');
    expect(html).toContain('value="2025-04-15"');
    expect(html).toContain('data-jaci-component="upload"');
    expect(html).toContain('data-slot="upload-dropzone"');
    expect(html).toContain('data-slot="upload-preview"');
    expect(html).toContain('data-slot="upload-progress"');
    expect(html).toContain('aria-valuenow="68"');
    expect(html).toContain('data-slot="date-picker-previous"');
    expect(html).toContain('data-slot="date-picker-next"');
    expect(html).toContain('type="file"');
  });

  it("renders advanced date and color controls without browser globals", () => {
    const html = renderToString(
      <>
        <DatePicker.Root
          defaultValue={new Date(2025, 3, 15, 14, 30)}
          granularity="month"
          name="billing-month"
          yearRange={{ end: 2030, start: 2020 }}
        >
          <DatePicker.MonthSelect />
          <DatePicker.YearSelect />
          <DatePicker.Calendar />
        </DatePicker.Root>
        <DatePicker.Root
          defaultValue={new Date(2025, 3, 15, 14, 30)}
          granularity="date-time"
          name="meeting-at"
        >
          <DatePicker.TimeField />
        </DatePicker.Root>
        <ColorPicker.Root defaultValue="#2563eb">
          <ColorPicker.Palette />
        </ColorPicker.Root>
      </>,
    );

    expect(html).toContain('data-slot="date-picker-month-select"');
    expect(html).toContain('data-slot="date-picker-time-field"');
    expect(html).toContain('data-slot="color-picker-palette-indicator"');
    expect(html).toContain('value="2025-04"');
    expect(html).toContain('value="2025-04-15T14:30"');
  });

  it("renders single and multiple option selectors with native form controls", () => {
    const html = renderToString(
      <form>
        <OptionSelector
          defaultValue="pro"
          label="Workspace plan"
          name="plan"
          options={[
            { label: "Starter", value: "starter" },
            { label: "Pro", value: "pro" },
          ]}
        />
        <OptionSelector
          defaultValue={["email"]}
          label="Notifications"
          multiple
          name="notifications"
          options={[
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
          ]}
        />
      </form>,
    );

    expect(html).toContain('data-jaci-component="option-selector"');
    expect(html).toContain('type="radio"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('name="plan"');
    expect(html).toContain('name="notifications"');
    expect(html).toContain("Pro");
    expect(html).toContain("Email");
  });

  it("renders form validation primitives and external errors on the server", () => {
    const html = renderToString(
      <Form errors={{ email: "Email is already in use." }} onFormSubmit={() => undefined}>
        <Fieldset.Root>
          <Fieldset.Legend>Account</Fieldset.Legend>
          <Field name="email">
            <FieldLabel htmlFor="ssr-email">Email</FieldLabel>
            <Input id="ssr-email" name="email" required type="email" />
            <FieldError />
          </Field>
        </Fieldset.Root>
        <VisuallyHidden>Validation status</VisuallyHidden>
      </Form>,
    );

    expect(html).toContain('data-jaci-component="form"');
    expect(html).toContain('data-jaci-component="fieldset"');
    expect(html).toContain('data-slot="field-label"');
    expect(html).toContain("Email is already in use.");
    expect(html).toContain('data-jaci-component="visually-hidden"');
  });
});
