import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Accordion,
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  BottomNavigation,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  ColorPicker,
  ContextMenu,
  DataView as JaciDataView,
  Dialog,
  DatePicker,
  Drawer,
  Field,
  FieldDescription,
  FieldLabel,
  Flex,
  Grid,
  Heading,
  Input,
  Link,
  List,
  Menu,
  Menubar,
  Navbar,
  NumberField,
  OptionSelector,
  Pagination,
  Paragraph,
  Popover,
  Progress,
  Separator,
  Select,
  Sidebar,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Switch,
  Tabs,
  Table,
  Text,
  Textarea,
  Toast,
  Tooltip,
  Upload,
} from "jaci-ui";
import "jaci-ui/styles.css";

interface PlaygroundToast {
  id: string;
  description: string;
  title: string;
  type: "success";
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState<string | null>("pro");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toast, setToast] = useState<PlaygroundToast | null>(null);

  return (
    <main
      data-jaci-theme={theme}
      style={{
        minHeight: "100vh",
        padding: "7rem 2rem",
        transition: "background-color 250ms",
      }}
    >
      <Navbar.Root open={navigationOpen} onOpenChange={setNavigationOpen}>
        <Navbar.Bar aria-label="Playground navigation">
          <Navbar.Start>
            <Navbar.Toggle />
            <Navbar.Item active href="#overview">
              Overview
            </Navbar.Item>
            <Navbar.Item href="#components">Components</Navbar.Item>
          </Navbar.Start>
          <Navbar.Center>
            <strong>Jaci UI</strong>
          </Navbar.Center>
          <Navbar.End>
            <Navbar.Item href="#docs">Docs</Navbar.Item>
          </Navbar.End>
        </Navbar.Bar>

        <Navbar.Drawer>
          <Navbar.Close />
          <Heading as="h2" size="lg" style={{ marginBottom: "0.5rem" }}>
            Jaci UI
          </Heading>
          <Navbar.Item active href="#overview" onClick={() => setNavigationOpen(false)}>
            Overview
          </Navbar.Item>
          <Navbar.Item href="#components" onClick={() => setNavigationOpen(false)}>
            Components
          </Navbar.Item>
          <Navbar.Item href="#docs" onClick={() => setNavigationOpen(false)}>
            Documentation
          </Navbar.Item>
        </Navbar.Drawer>
      </Navbar.Root>

      <Stack gap="lg" style={{ margin: "0 auto", maxWidth: "72rem" }}>
        <Flex align="center" justify="between">
          <Stack direction="horizontal" align="center" gap="sm">
            <Badge tone="accent">Vite playground</Badge>
            <Text size="sm" tone="muted">
              jaci-ui/styles.css
            </Text>
          </Stack>
          <Button
            aria-label="Toggle color theme"
            size="sm"
            variant="ghost"
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? "Use dark theme" : "Use light theme"}
          </Button>
        </Flex>

        <Stack gap="sm">
          <Heading as="h1" size="2xl">
            Jaci UI playground
          </Heading>
          <Text size="lg" tone="muted">
            A real Vite consumer of the package, useful for checking default styles and theme
            overrides outside Storybook.
          </Text>
          <Paragraph>
            The default visual language keeps the quiet zinc surfaces, rounded cards, responsive
            headings and generous reading rhythm of the original components.
          </Paragraph>
        </Stack>

        <Separator />

        <Grid columns={2} gap="lg">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Actions and feedback</CardTitle>
              <Text tone="muted" size="sm">
                The common interaction states are ready without a CSS reset.
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <Flex direction="horizontal" gap="sm" style={{ flexWrap: "wrap" }}>
                  <Button variant="solid">Save changes</Button>
                  <Button>Secondary action</Button>
                  <Button variant="ghost">Cancel</Button>
                  <Button loading>Saving</Button>
                </Flex>
                <Flex direction="horizontal" align="center" gap="sm">
                  <Spinner size="sm" />
                  <Text size="sm" tone="muted">
                    Loading indicator
                  </Text>
                </Flex>
                <Alert.Root tone="success">
                  <Alert.Icon />
                  <Alert.Title>Workspace saved</Alert.Title>
                  <Alert.Description>
                    The default feedback styles use the same neutral surfaces and semantic tokens.
                  </Alert.Description>
                </Alert.Root>
                <Progress label="Release checklist" max={8} value={6} />
                <Flex direction="horizontal" align="center" gap="sm">
                  <Skeleton variant="circle" />
                  <Stack gap="sm" style={{ flex: 1 }}>
                    <Skeleton variant="text" style={{ width: "45%" }} />
                    <Skeleton animated={false} variant="text" />
                  </Stack>
                </Flex>
              </Stack>
            </CardContent>
            <CardFooter>
              <Badge>Neutral</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <Text tone="muted" size="sm">
                Native controls with accessible labels and visible focus states.
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap="md">
                <Field>
                  <FieldLabel htmlFor="playground-name">Name</FieldLabel>
                  <Input id="playground-name" placeholder="Ada Lovelace" />
                  <FieldDescription>Your public display name.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="playground-message">Message</FieldLabel>
                  <Textarea id="playground-message" placeholder="Write something…" />
                </Field>
                <Field>
                  <Select.Root name="plan" value={plan} onValueChange={setPlan}>
                    <Select.Label>Workspace plan</Select.Label>
                    <Select.Trigger>
                      <Select.Value placeholder="Choose a plan" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Positioner align="start" side="bottom" sideOffset={8}>
                        <Select.Popup>
                          <Select.List>
                            <Select.Group>
                              <Select.GroupLabel>Individual</Select.GroupLabel>
                              <Select.Item value="starter">
                                <Select.ItemText>Starter</Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                              <Select.Item value="pro">
                                <Select.ItemText>Pro</Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                            </Select.Group>
                            <Select.Separator />
                            <Select.Group>
                              <Select.GroupLabel>Teams</Select.GroupLabel>
                              <Select.Item value="team">
                                <Select.ItemText>Team</Select.ItemText>
                                <Select.ItemIndicator />
                              </Select.Item>
                            </Select.Group>
                          </Select.List>
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                  <FieldDescription>
                    The select uses Base UI listbox semantics and submits through its hidden input.
                  </FieldDescription>
                </Field>
                <OptionSelector
                  defaultValue="pro"
                  description="Use the option cards for compact plan or preference choices."
                  label="Workspace plan"
                  name="playground-plan"
                  options={[
                    { label: "Starter", value: "starter" },
                    { label: "Pro", value: "pro" },
                    { label: "Team", value: "team" },
                  ]}
                />
                <Flex align="center" gap="sm">
                  <Checkbox defaultChecked id="playground-updates" />
                  <FieldLabel htmlFor="playground-updates">Send product updates</FieldLabel>
                </Flex>
                <Flex align="center" justify="between">
                  <FieldLabel htmlFor="playground-notifications">Enable notifications</FieldLabel>
                  <Switch
                    checked={notifications}
                    id="playground-notifications"
                    onCheckedChange={setNotifications}
                  />
                </Flex>
                <Slider.Root defaultValue={56} max={100} min={0} name="playground-volume">
                  <Flex align="center" justify="between">
                    <Slider.Label>Volume</Slider.Label>
                    <Slider.Value />
                  </Flex>
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Indicator />
                      <Slider.Thumb aria-label="Volume" />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>
                <NumberField.Root defaultValue={2} max={10} min={0} name="playground-seats">
                  <NumberField.Label>Seats</NumberField.Label>
                  <NumberField.Group>
                    <NumberField.Decrement />
                    <NumberField.Input aria-label="Seats" />
                    <NumberField.Increment />
                  </NumberField.Group>
                </NumberField.Root>
              </Stack>
            </CardContent>
            <CardFooter>
              <Link href="https://github.com/ribborges/jaci">View the source</Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navigation sidebar</CardTitle>
              <Text tone="muted" size="sm">
                The compact rail preserves its labels for assistive technology while it is
                collapsed.
              </Text>
            </CardHeader>
            <CardContent>
              <Sidebar.Root defaultOpen style={{ height: "16rem" }}>
                <Sidebar.Header>
                  <Sidebar.Label>Jaci workspace</Sidebar.Label>
                </Sidebar.Header>
                <Sidebar.Toggle />
                <Sidebar.Content aria-label="Playground navigation">
                  <Sidebar.Item active href="#overview">
                    <span aria-hidden="true">⌂</span>
                    <Sidebar.Label>Overview</Sidebar.Label>
                  </Sidebar.Item>
                  <Sidebar.Item href="#projects">
                    <span aria-hidden="true">◫</span>
                    <Sidebar.Label>Projects</Sidebar.Label>
                  </Sidebar.Item>
                  <Sidebar.Item href="#settings">
                    <span aria-hidden="true">⚙</span>
                    <Sidebar.Label>Settings</Sidebar.Label>
                  </Sidebar.Item>
                </Sidebar.Content>
              </Sidebar.Root>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date and file inputs</CardTitle>
              <Text tone="muted" size="sm">
                The calendar and dropzone keep their value semantics while staying SSR-safe.
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap="lg">
                <DatePicker.Root
                  defaultValue={new Date(2025, 3, 15, 12, 0, 0, 0)}
                  maxDate={new Date(2025, 3, 30, 12, 0, 0, 0)}
                  minDate={new Date(2025, 3, 7, 12, 0, 0, 0)}
                  name="release-date"
                  weekStartsOn={1}
                >
                  <DatePicker.Label>Release date</DatePicker.Label>
                  <DatePicker.Control>
                    <DatePicker.Trigger>
                      <DatePicker.Value placeholder="Choose a date" />
                    </DatePicker.Trigger>
                    <DatePicker.Clear />
                  </DatePicker.Control>
                  <DatePicker.Portal>
                    <DatePicker.Positioner align="start" side="bottom" sideOffset={8}>
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

                <Upload.Root accept="image/*,.pdf" maxSize={5 * 1024 * 1024} multiple>
                  <Upload.Dropzone aria-label="Upload attachments">
                    <Upload.Input />
                    <Upload.Icon />
                    <Upload.Text>Drop attachments here</Upload.Text>
                    <Upload.Hint>Images and PDF files up to 5 MB.</Upload.Hint>
                  </Upload.Dropzone>
                  <Upload.Error />
                  <Upload.List />
                  <Upload.Progress label="Upload progress" value={0} />
                </Upload.Root>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identity and page context</CardTitle>
              <Text tone="muted" size="sm">
                Static primitives remain server-safe while supporting the same scoped theme.
              </Text>
            </CardHeader>
            <CardContent>
              <Stack gap="lg">
                <Flex direction="horizontal" align="center" gap="sm">
                  <Avatar.Root aria-label="Jaci UI" size="lg">
                    <Avatar.Fallback>JU</Avatar.Fallback>
                  </Avatar.Root>
                  <Avatar.Root aria-label="Richard Borges" shape="rounded" size="lg">
                    <Avatar.Fallback>RB</Avatar.Fallback>
                  </Avatar.Root>
                  <Text size="sm" tone="muted">
                    Avatar fallback
                  </Text>
                </Flex>

                <Breadcrumbs.Root>
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item>
                      <Breadcrumbs.Link href="#overview">Workspace</Breadcrumbs.Link>
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Separator />
                    <Breadcrumbs.Item>
                      <Breadcrumbs.Link href="#components">Components</Breadcrumbs.Link>
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Separator />
                    <Breadcrumbs.Item>
                      <Breadcrumbs.Current>Playground</Breadcrumbs.Current>
                    </Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Breadcrumbs.Root>

                <Pagination.Root>
                  <Pagination.List>
                    <Pagination.Item>
                      <Pagination.Previous disabled />
                    </Pagination.Item>
                    <Pagination.Item>
                      <Pagination.Link active href="#page-1">
                        1
                      </Pagination.Link>
                    </Pagination.Item>
                    <Pagination.Item>
                      <Pagination.Link href="#page-2">2</Pagination.Link>
                    </Pagination.Item>
                    <Pagination.Item>
                      <Pagination.Ellipsis />
                    </Pagination.Item>
                    <Pagination.Item>
                      <Pagination.Next href="#page-2" />
                    </Pagination.Item>
                  </Pagination.List>
                </Pagination.Root>
              </Stack>
            </CardContent>
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <CardHeader>
              <CardTitle>Base UI interactions</CardTitle>
              <Text tone="muted" size="sm">
                Tabs, disclosures and dialogs keep their accessibility behavior while receiving the
                Jaci visual language.
              </Text>
            </CardHeader>
            <CardContent>
              <Grid columns={2} gap="lg">
                <Tabs.Root defaultValue="overview">
                  <Tabs.List aria-label="Playground sections">
                    <Tabs.Tab value="overview">Overview</Tabs.Tab>
                    <Tabs.Tab value="activity">Activity</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="overview">
                    <Text>Use the arrow keys to move between tabs.</Text>
                  </Tabs.Panel>
                  <Tabs.Panel value="activity">
                    <Text>Panels receive the correct tab relationship from Base UI.</Text>
                  </Tabs.Panel>
                </Tabs.Root>

                <Accordion.Root defaultValue={["themes"]}>
                  <Accordion.Item value="themes">
                    <Accordion.Header>
                      <Accordion.Trigger>How do themes work?</Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                      <Text tone="muted">
                        Set data-jaci-theme on the server-rendered root or a local wrapper.
                      </Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item value="styles">
                    <Accordion.Header>
                      <Accordion.Trigger>Can I override styles?</Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                      <Text tone="muted">
                        Yes — use semantic CSS variables, variants, className and slot attributes.
                      </Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion.Root>
              </Grid>

              <Collapsible.Root style={{ marginTop: "1.5rem" }}>
                <Collapsible.Trigger>Show SSR note</Collapsible.Trigger>
                <Collapsible.Panel>
                  <Text tone="muted">
                    No component reads window or document during rendering, so this same UI can be
                    rendered first by Next or React Router.
                  </Text>
                </Collapsible.Panel>
              </Collapsible.Root>

              <JaciDataView.Root layout="grid" columns={2}>
                <JaciDataView.Toolbar>
                  <Text style={{ fontWeight: 600 }}>Data display</Text>
                </JaciDataView.Toolbar>
                <JaciDataView.Content>
                  <Table.Container>
                    <Table.Root aria-label="Fixture members">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>Jaci UI</Table.Cell>
                          <Table.Cell>Ready</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Table.Container>
                  <List.Root variant="divided">
                    <List.Item>
                      <List.ItemContent>
                        <List.ItemTitle>SSR ready</List.ItemTitle>
                        <List.ItemDescription>Static data display primitives.</List.ItemDescription>
                      </List.ItemContent>
                    </List.Item>
                  </List.Root>
                </JaciDataView.Content>
              </JaciDataView.Root>

              <ColorPicker.Root defaultValue="#2563eb">
                <ColorPicker.Trigger aria-label="Choose fixture color">
                  <ColorPicker.Preview />
                  <ColorPicker.Value />
                </ColorPicker.Trigger>
              </ColorPicker.Root>
            </CardContent>
            <CardFooter>
              <Flex direction="horizontal" gap="sm" style={{ flexWrap: "wrap" }}>
                <Menu.Root>
                  <Menu.Trigger>Open project menu</Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner align="start" side="bottom" sideOffset={8}>
                      <Menu.Popup aria-label="Playground actions">
                        <Menu.Group>
                          <Menu.GroupLabel>Project</Menu.GroupLabel>
                          <Menu.Item>Duplicate</Menu.Item>
                          <Menu.LinkItem href="#playground">Open details</Menu.LinkItem>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.Item>Archive</Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
                <ContextMenu.Root>
                  <ContextMenu.Trigger
                    style={{
                      border: "1px dashed currentColor",
                      borderRadius: "0.5rem",
                      padding: "0.5rem",
                    }}
                  >
                    Right-click fixture
                  </ContextMenu.Trigger>
                  <ContextMenu.Portal>
                    <ContextMenu.Positioner>
                      <ContextMenu.Popup>
                        <ContextMenu.Item>Copy</ContextMenu.Item>
                        <ContextMenu.Item>Inspect</ContextMenu.Item>
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
                          <Menubar.Item>Open project</Menubar.Item>
                        </Menubar.Popup>
                      </Menubar.Positioner>
                    </Menubar.Portal>
                  </Menubar.Menu>
                </Menubar.Root>
                <Tooltip.Root>
                  <Tooltip.Trigger>Why Base UI?</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner side="top" sideOffset={8}>
                      <Tooltip.Popup>
                        It provides accessible behavior without imposing a visual system.
                        <Tooltip.Arrow />
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root>
                <Popover.Root>
                  <Popover.Trigger>View package details</Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Positioner align="start" side="bottom" sideOffset={8}>
                      <Popover.Popup>
                        <Popover.Arrow />
                        <Popover.Title>Jaci UI</Popover.Title>
                        <Popover.Description>
                          The Vite fixture imports the workspace package and its generated CSS.
                        </Popover.Description>
                        <Popover.Close />
                      </Popover.Popup>
                    </Popover.Positioner>
                  </Popover.Portal>
                </Popover.Root>
                <Dialog.Root open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
                  <Dialog.Trigger>Open modal preview</Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Viewport>
                      <Dialog.Popup size="sm">
                        <Dialog.Header>
                          <Dialog.Title>Jaci UI dialog</Dialog.Title>
                          <Dialog.Close />
                        </Dialog.Header>
                        <Dialog.Body>
                          <Dialog.Description>
                            This is a controlled Base UI dialog rendered by a real Vite consumer.
                          </Dialog.Description>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.Close>Close</Dialog.Close>
                        </Dialog.Footer>
                      </Dialog.Popup>
                    </Dialog.Viewport>
                  </Dialog.Portal>
                </Dialog.Root>
                <AlertDialog.Root
                  open={alertDialogOpen}
                  onOpenChange={(open) => setAlertDialogOpen(open)}
                >
                  <AlertDialog.Trigger>Delete preview</AlertDialog.Trigger>
                  <AlertDialog.Portal>
                    <AlertDialog.Backdrop />
                    <AlertDialog.Viewport>
                      <AlertDialog.Popup size="sm">
                        <AlertDialog.Header>
                          <AlertDialog.Title>Delete preview?</AlertDialog.Title>
                          <AlertDialog.Close />
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                          <AlertDialog.Description>
                            The action is intentionally isolated in an alert dialog.
                          </AlertDialog.Description>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel />
                          <AlertDialog.Action>Delete</AlertDialog.Action>
                        </AlertDialog.Footer>
                      </AlertDialog.Popup>
                    </AlertDialog.Viewport>
                  </AlertDialog.Portal>
                </AlertDialog.Root>
                <Drawer.Root side="right">
                  <Drawer.Trigger>Open side panel</Drawer.Trigger>
                  <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport>
                      <Drawer.Popup>
                        <Drawer.Header>
                          <Drawer.Title>Side panel</Drawer.Title>
                          <Drawer.Close />
                        </Drawer.Header>
                        <Drawer.Content>
                          <Text>Responsive content with swipe and Escape dismissal.</Text>
                        </Drawer.Content>
                      </Drawer.Popup>
                    </Drawer.Viewport>
                  </Drawer.Portal>
                </Drawer.Root>
                <Toast.Provider timeout={0}>
                  <Button
                    onClick={() =>
                      setToast({
                        id: "playground-saved",
                        description:
                          "The visual playground is running from the published package API.",
                        title: "Changes saved",
                        type: "success",
                      })
                    }
                  >
                    Show toast
                  </Button>
                  <Toast.Portal>
                    <Toast.Viewport>
                      {toast ? (
                        <Toast.Root toast={toast}>
                          <Toast.Content>
                            <Toast.Text>
                              <Toast.Title />
                              <Toast.Description />
                            </Toast.Text>
                            <Toast.Close onClick={() => setToast(null)} />
                          </Toast.Content>
                        </Toast.Root>
                      ) : null}
                    </Toast.Viewport>
                  </Toast.Portal>
                </Toast.Provider>
              </Flex>
            </CardFooter>
          </Card>
        </Grid>
      </Stack>

      <BottomNavigation aria-label="Playground mobile navigation">
        <BottomNavigation.Item active href="#overview">
          <span aria-hidden="true">⌂</span>
          Overview
        </BottomNavigation.Item>
        <BottomNavigation.Item href="#components">
          <span aria-hidden="true">□</span>
          Components
        </BottomNavigation.Item>
        <BottomNavigation.Item href="#docs">
          <span aria-hidden="true">?</span>
          Docs
        </BottomNavigation.Item>
      </BottomNavigation>
    </main>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Missing root element");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
