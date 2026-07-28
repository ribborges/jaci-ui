import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const assetsDirectory = new URL("./dist/assets/", import.meta.url).pathname;
const assets = await readdir(assetsDirectory);
const javascript = (
  await Promise.all(
    assets
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFile(join(assetsDirectory, file), "utf8")),
  )
).join("\n");
const stylesheet = (
  await Promise.all(
    assets
      .filter((file) => file.endsWith(".css"))
      .map((file) => readFile(join(assetsDirectory, file), "utf8")),
  )
).join("\n");

for (const unusedComponent of ["DatePicker", "ColorPicker", "TreeView", "Dialog"]) {
  if (javascript.includes(unusedComponent)) {
    throw new Error(`Tree-shaking fixture retained unused component ${unusedComponent}`);
  }
}

if (!stylesheet.includes("--jaci-colors-accent-default")) {
  throw new Error("Tree-shaking fixture did not retain jaci-ui/styles.css");
}

console.log(`Tree-shaking fixture passed (${Buffer.byteLength(javascript)} JavaScript bytes).`);
