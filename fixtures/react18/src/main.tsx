import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, ColorPicker, Stack, Text } from "jaci-ui";
import "jaci-ui/styles.css";

function App() {
  const [color, setColor] = useState("#2563eb");

  return (
    <main style={{ padding: "2rem" }}>
      <Stack gap="md">
        <Text>React 18 consumer fixture</Text>
        <Button>Continue</Button>
        <ColorPicker.Root value={color} onValueChange={setColor}>
          <ColorPicker.Label>Accent</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Trigger>
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
              </ColorPicker.Popup>
            </ColorPicker.Positioner>
          </ColorPicker.Portal>
        </ColorPicker.Root>
      </Stack>
    </main>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("React 18 fixture root element is missing.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
