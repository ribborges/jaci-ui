import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";

const packageRoot = new URL("../", import.meta.url).pathname;
const packageJson = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
const destination = await mkdtemp(join(tmpdir(), "jaci-ui-package-check-"));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const suppliedTarball = process.env.JACI_TARBALL
  ? resolve(process.cwd(), process.env.JACI_TARBALL)
  : undefined;

function run(command, args, cwd = packageRoot) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      reject(new Error(`${command} exited with ${signal ?? `code ${code}`}`));
    });
  });
}

function archiveEntries(tarball) {
  return execFileSync("tar", ["-tzf", tarball], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((entry) => entry.replace(/^package\//, "").replace(/\/$/, ""));
}

function archiveFile(tarball, file) {
  return execFileSync("tar", ["-xOf", tarball, `package/${file}`], { encoding: "utf8" });
}

function assertContract(tarball) {
  const entries = archiveEntries(tarball);
  const entrySet = new Set(entries);
  const allowedRootFiles = new Set(["README.md", "CHANGELOG.md", "LICENSE"]);
  const unexpected = entries.filter(
    (entry) =>
      entry &&
      entry !== "dist" &&
      !entry.startsWith("dist/") &&
      !allowedRootFiles.has(entry) &&
      entry !== "package.json",
  );

  if (unexpected.length > 0) {
    throw new Error(
      `Tarball contains files outside the distribution allowlist: ${unexpected.join(", ")}`,
    );
  }

  const requiredFiles = {
    "README.md": ["Installation", "jaci-ui/styles.css"],
    "CHANGELOG.md": ["# Changelog"],
    LICENSE: ["MIT License"],
    "dist/styles.css": ["--jaci-"],
  };
  for (const [required, markers] of Object.entries(requiredFiles)) {
    const content = entrySet.has(required) ? archiveFile(tarball, required).trim() : "";
    if (!content || markers.some((marker) => !content.includes(marker))) {
      throw new Error(`Tarball is missing required content in: ${required}`);
    }
  }

  if (!archiveFile(tarball, "LICENSE").startsWith("MIT License")) {
    throw new Error("The published LICENSE must be MIT");
  }

  const packedManifest = JSON.parse(archiveFile(tarball, "package.json"));
  if (packedManifest.license !== "MIT") {
    throw new Error(`Expected MIT package metadata, received ${packedManifest.license}`);
  }
  if (packedManifest.engines?.node !== ">=18.18.0") {
    throw new Error(
      `Expected consumer Node engine >=18.18.0, received ${packedManifest.engines?.node}`,
    );
  }
  if (JSON.stringify(packedManifest.sideEffects) !== JSON.stringify(["./dist/styles.css"])) {
    throw new Error("Only the distributed stylesheet may be marked as a side effect");
  }

  const exportKeys = Object.keys(packedManifest.exports ?? {}).sort();
  const expectedExportKeys = [".", "./panda-preset", "./styles.css"];
  if (JSON.stringify(exportKeys) !== JSON.stringify(expectedExportKeys)) {
    throw new Error(`Unexpected package exports: ${exportKeys.join(", ")}`);
  }

  for (const required of [
    "dist/index.js",
    "dist/index.cjs",
    "dist/index.d.ts",
    "dist/index.d.cts",
    "dist/panda-preset.js",
    "dist/panda-preset.cjs",
    "dist/panda-preset.d.ts",
    "dist/panda-preset.d.cts",
  ]) {
    if (!entrySet.has(required)) {
      throw new Error(`Tarball is missing a required package artifact: ${required}`);
    }
  }

  // Rolldown may emit a tiny internal CJS helper for external dependencies. It is
  // implementation detail (not a public module) and does not have a source map;
  // every public JavaScript artifact still must have its corresponding map.
  const runtimeFiles = entries.filter(
    (entry) =>
      !entry.startsWith("dist/_virtual/") && (entry.endsWith(".js") || entry.endsWith(".cjs")),
  );
  const missingSourceMaps = runtimeFiles.filter((entry) => !entrySet.has(`${entry}.map`));
  if (missingSourceMaps.length > 0) {
    throw new Error(`JavaScript artifacts without sourcemaps: ${missingSourceMaps.join(", ")}`);
  }
}

async function checkRuntimeExports(tarball) {
  const consumerDirectory = join(destination, "consumer");
  await mkdir(consumerDirectory, { recursive: true });
  await writeFile(
    join(consumerDirectory, "package.json"),
    `${JSON.stringify(
      {
        name: "jaci-ui-package-contract-consumer",
        private: true,
        type: "module",
        dependencies: {
          "jaci-ui": `file:${tarball}`,
          "@pandacss/dev": "^1.11.4",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
      },
      null,
      2,
    )}\n`,
  );
  await run(
    pnpm,
    ["install", "--ignore-workspace", "--lockfile=false", "--prefer-offline", "--ignore-scripts"],
    consumerDirectory,
  );
  await run(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `import { createRequire } from "node:module";
const esm = await import("jaci-ui");
const cjs = createRequire(import.meta.url)("jaci-ui");
const presetEsm = await import("jaci-ui/panda-preset");
const presetCjs = createRequire(import.meta.url)("jaci-ui/panda-preset");
for (const [name, value] of [["esm.Button", esm.Button], ["cjs.Button", cjs.Button], ["esm.pandaPreset", presetEsm.default], ["cjs.pandaPreset", presetCjs]]) {
  if (!value) throw new Error(name + " is not exported by the packed package");
}
console.log("ESM and CJS package exports resolved successfully.");`,
    ],
    consumerDirectory,
  );
}

try {
  if (!suppliedTarball) {
    await run(pnpm, ["pack", "--pack-destination", destination]);
  }

  const tarball =
    suppliedTarball ??
    join(destination, (await readdir(destination)).find((file) => file.endsWith(".tgz")) ?? "");
  if (!tarball?.endsWith(".tgz")) {
    throw new Error("pnpm pack did not produce a tarball");
  }

  assertContract(tarball);
  await run(pnpm, ["exec", "publint", tarball]);
  await run(pnpm, [
    "exec",
    "attw",
    tarball,
    "--format",
    "table",
    "--profile",
    "node16",
    "--exclude-entrypoints",
    "./styles.css",
  ]);
  await checkRuntimeExports(tarball);
} finally {
  await rm(destination, { force: true, recursive: true });
}

console.log(`${packageJson.name} package contract validation completed.`);
