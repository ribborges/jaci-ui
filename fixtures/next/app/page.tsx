import {
  AlertDialogRoot,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ColorPickerPreview,
  ColorPickerRoot,
  ColorPickerTrigger,
  ContextMenuRoot,
  ContextMenuTrigger,
  DataViewContent,
  DataViewRoot,
  DrawerRoot,
  DrawerTrigger,
  Heading,
  ListItem,
  ListRoot,
  MenubarMenu,
  MenubarRoot,
  MenubarTrigger,
  Stack,
  TableBody,
  TableCell,
  TableRoot,
  TableRow,
  Text,
} from "jaci-ui";

export default function Page() {
  return (
    <main style={{ margin: "2rem auto", maxWidth: "42rem" }}>
      <Stack gap="lg">
        <Badge tone="accent">Next App Router</Badge>
        <Heading as="h1">SSR-ready Jaci UI</Heading>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Client boundaries stay inside the package</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>This server component can render a Jaci UI button directly.</Text>
            <Button variant="solid">Continue</Button>
            <AlertDialogRoot>
              <AlertDialogTrigger>Delete item</AlertDialogTrigger>
            </AlertDialogRoot>
            <DrawerRoot side="right">
              <DrawerTrigger>Open details</DrawerTrigger>
            </DrawerRoot>
            <ContextMenuRoot>
              <ContextMenuTrigger>Right-click item</ContextMenuTrigger>
            </ContextMenuRoot>
            <MenubarRoot>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
              </MenubarMenu>
            </MenubarRoot>
            <TableRoot aria-label="Next members">
              <TableBody>
                <TableRow>
                  <TableCell>Server-rendered row</TableCell>
                </TableRow>
              </TableBody>
            </TableRoot>
            <ListRoot>
              <ListItem>Server-rendered list</ListItem>
            </ListRoot>
            <DataViewRoot layout="list">
              <DataViewContent>Server-rendered data view</DataViewContent>
            </DataViewRoot>
            <ColorPickerRoot defaultValue="#2563eb">
              <ColorPickerTrigger aria-label="Choose color">
                <ColorPickerPreview />
              </ColorPickerTrigger>
            </ColorPickerRoot>
          </CardContent>
        </Card>
      </Stack>
    </main>
  );
}
