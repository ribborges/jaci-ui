import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = join(root, "packages/ui/src");
const distRoot = join(root, "packages/ui/dist");
const snapshotPath = join(root, "docs/api-contract/0.9.0.json");
const update = process.argv.includes("--update");

function sorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function walk(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function readSourceModules() {
  const index = readFileSync(join(sourceRoot, "index.ts"), "utf8");
  return sorted(
    [...index.matchAll(/export \* from ["'](\.\/[^"']+)["'];/g)].map((match) => match[1]),
  );
}

function readPublicExports() {
  const declarationPath = join(distRoot, "index.d.ts");
  if (!existsSync(declarationPath)) {
    throw new Error(
      "packages/ui/dist/index.d.ts is missing. Run pnpm --filter jaci-ui build first.",
    );
  }
  const declaration = readFileSync(declarationPath, "utf8");
  const exportBlock = declaration.match(/export \{([\s\S]*)\};\s*$/)?.[1];
  if (!exportBlock)
    throw new Error("Could not find the public export declaration in dist/index.d.ts");

  return sorted(
    exportBlock
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) =>
        entry
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)[0]
          .trim(),
      ),
  );
}

function readDataContract() {
  const componentFiles = walk(join(sourceRoot, "components")).filter(
    (file) => /\.(ts|tsx)$/.test(file) && !/\.(test|stories)\./.test(file),
  );
  const slots = new Map();
  const components = new Set();

  for (const file of componentFiles) {
    const source = readFileSync(file, "utf8");
    const componentMatches = [...source.matchAll(/data-jaci-component=["']([^"']+)["']/g)];
    const slotMatches = [...source.matchAll(/data-slot=["']([^"']+)["']/g)];
    for (const match of componentMatches) components.add(match[1]);
    for (const match of slotMatches) {
      const slot = match[1];
      const owner = componentMatches[0]?.[1] ?? "unscoped";
      if (!slots.has(owner)) slots.set(owner, []);
      slots.get(owner).push(slot);
    }
  }

  return {
    components: sorted(components),
    slots: Object.fromEntries(
      [...slots.entries()]
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([owner, values]) => [owner, sorted(values)]),
    ),
  };
}

function readClientModules() {
  const source = readFileSync(
    join(root, "packages/ui/scripts/verify-client-boundaries.mjs"),
    "utf8",
  );
  return sorted(
    [...source.matchAll(/"(components\/[^"']+\.js|theme\/[^"']+\.js)"/g)].map((match) =>
      match[1].replace(/\.js$/, ""),
    ),
  );
}

function readCallbackNames() {
  const declarationFiles = walk(distRoot).filter((file) => file.endsWith(".d.ts"));
  const callbackNames = [];
  for (const file of declarationFiles) {
    const declaration = readFileSync(file, "utf8");
    for (const match of declaration.matchAll(/\b(on[A-Z][A-Za-z0-9]*)\??\s*:/g)) {
      callbackNames.push(match[1]);
    }
  }
  return sorted(callbackNames);
}

function createContract() {
  const data = readDataContract();
  return {
    version: "0.9.0",
    generatedFrom: {
      source: "packages/ui/src/index.ts",
      declarations: "packages/ui/dist/index.d.ts",
    },
    exports: readPublicExports(),
    sourceModules: readSourceModules(),
    callbacks: readCallbackNames(),
    dataContract: data,
    aliases: {
      Paragraph: "typography.Paragraph",
      "Button.render": "button.ButtonProps.render",
    },
    clientModules: readClientModules(),
    experimental: [],
  };
}

const contract = createContract();
if (update || !existsSync(snapshotPath)) {
  const directory = join(root, "docs/api-contract");
  mkdirSync(directory, { recursive: true });
  writeFileSync(snapshotPath, `${JSON.stringify(contract, null, 2)}\n`);
  console.log(`${update ? "Updated" : "Created"} ${relative(root, snapshotPath)}`);
  process.exit(0);
}

const expected = JSON.parse(readFileSync(snapshotPath, "utf8"));
if (JSON.stringify(expected) !== JSON.stringify(contract)) {
  console.error(`API contract changed: ${relative(root, snapshotPath)}`);
  console.error("Review the public API change and run pnpm api:contract:update intentionally.");
  process.exit(1);
}

const requiredAliases = ["Paragraph", "Button.render"];
for (const alias of requiredAliases) {
  if (!expected.aliases?.[alias])
    throw new Error(`Required compatibility alias is missing: ${alias}`);
}
if (contract.exports.includes("Marquee")) {
  throw new Error("Marquee is experimental and must not be part of the public exports.");
}

console.log("Public API contract is unchanged.");
