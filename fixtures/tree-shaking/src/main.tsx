import { createRoot } from "react-dom/client";
import { Button } from "jaci-ui";
import "jaci-ui/styles.css";

function App() {
  return <Button>Tree-shaken import</Button>;
}

const root = document.getElementById("root");
if (!root) throw new Error("Tree-shaking fixture root is missing.");

createRoot(root).render(<App />);
