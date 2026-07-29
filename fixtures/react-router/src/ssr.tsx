import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import {
  AlertDialog,
  Button,
  Calendar,
  Carousel,
  Checkbox,
  ColorPicker,
  Combobox,
  ContextMenu,
  DataView as JaciDataView,
  DateRangePicker,
  DownloadTrigger,
  Drawer,
  Field,
  FieldError,
  FieldLabel,
  Fieldset,
  Form,
  Heading,
  Input,
  List,
  NumberField,
  PinInput,
  QRCode,
  Menubar,
  RadioGroup,
  Stack,
  Slider,
  Table,
  Text,
  VisuallyHidden,
  Switch,
} from "jaci-ui";

const html = renderToString(
  <StaticRouter location="/">
    <main data-jaci-theme="dark">
      <Stack>
        <Heading as="h1">React Router SSR</Heading>
        <Text>Jaci UI can render before hydration.</Text>
        <Button>Open</Button>
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
        <Table.Root aria-label="Router members">
          <Table.Body>
            <Table.Row id="ssr-row">
              <Table.Cell>SSR row</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
        <List.Root>
          <List.Item>SSR list item</List.Item>
        </List.Root>
        <Carousel.Root aria-label="SSR slides">
          <Carousel.Viewport>
            <Carousel.Track>
              <Carousel.Item index={0}>SSR slide</Carousel.Item>
            </Carousel.Track>
          </Carousel.Viewport>
        </Carousel.Root>
        <DownloadTrigger href="data:text/plain,SSR">Download SSR file</DownloadTrigger>
        <QRCode label="SSR QR code" value="https://jaci-ui.dev" />
        <JaciDataView.Root layout="list">
          <JaciDataView.Content>SSR data view</JaciDataView.Content>
        </JaciDataView.Root>
        <ColorPicker.Root defaultValue="#2563eb">
          <ColorPicker.Trigger aria-label="Choose color">
            <ColorPicker.Preview />
          </ColorPicker.Trigger>
        </ColorPicker.Root>
        <Calendar.Root referenceDate={new Date(2025, 3, 1, 12)} aria-label="Calendar">
          <Calendar.Header>
            <Calendar.Previous />
            <Calendar.Caption />
            <Calendar.Next />
          </Calendar.Header>
          <Calendar.Grid />
        </Calendar.Root>
        <DateRangePicker.Root referenceDate={new Date(2025, 3, 1, 12)}>
          <DateRangePicker.Trigger aria-label="Choose period" />
        </DateRangePicker.Root>
        <PinInput.Root length={4} defaultValue="1234" name="pin">
          <PinInput.Label>PIN</PinInput.Label>
          <PinInput.Control>
            <PinInput.Inputs />
          </PinInput.Control>
        </PinInput.Root>
        <Form errors={{ email: "Use a valid email address." }} onFormSubmit={() => undefined}>
          <Fieldset.Root>
            <Fieldset.Legend>Contact</Fieldset.Legend>
            <Field name="email">
              <FieldLabel htmlFor="router-email">Email</FieldLabel>
              <Input id="router-email" name="email" required type="email" />
              <FieldError />
            </Field>
          </Fieldset.Root>
          <VisuallyHidden>Validation messages are announced here.</VisuallyHidden>
        </Form>
        <Combobox.Root items={["React", "Vite"]} name="framework">
          <Combobox.Label>Framework</Combobox.Label>
          <Combobox.InputGroup>
            <Combobox.Input placeholder="Search frameworks" />
            <Combobox.Clear />
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
            <RadioGroup.Option>
              <RadioGroup.Item value="free">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              Free
            </RadioGroup.Option>
          </RadioGroup.Options>
        </RadioGroup.Root>
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
        <Checkbox defaultChecked id="router-updates" name="updates" />
        <Switch defaultChecked name="notifications" />
      </Stack>
    </main>
  </StaticRouter>,
);

if (
  !html.includes("React Router SSR") ||
  !html.includes('data-jaci-component="button"') ||
  !html.includes('data-jaci-component="form"') ||
  !html.includes("Use a valid email address.") ||
  !html.includes('data-slot="combobox-input"') ||
  !html.includes('data-slot="radio-group-item"') ||
  !html.includes('role="radiogroup"') ||
  !html.includes('data-jaci-component="slider"') ||
  !html.includes('data-jaci-component="number-field"') ||
  !html.includes('role="checkbox"') ||
  !html.includes('role="switch"') ||
  !html.includes('data-slot="alert-dialog-trigger"') ||
  !html.includes('data-slot="drawer-trigger"') ||
  !html.includes('data-slot="context-menu-trigger"') ||
  !html.includes('data-slot="menubar-trigger"') ||
  !html.includes('data-slot="table-cell"') ||
  !html.includes('data-jaci-component="list"') ||
  !html.includes('data-jaci-component="carousel"') ||
  !html.includes('data-jaci-component="download-trigger"') ||
  !html.includes('data-jaci-component="qr-code"') ||
  !html.includes('data-jaci-component="data-view"') ||
  !html.includes('data-slot="color-picker-trigger"') ||
  !html.includes('data-slot="calendar"') ||
  !html.includes('data-jaci-component="date-range-picker"') ||
  !html.includes('data-jaci-component="pin-input"')
) {
  throw new Error("Jaci UI did not render as expected in the React Router SSR fixture");
}
