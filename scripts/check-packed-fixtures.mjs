import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const artifactsDirectory = join(root, ".artifacts");
const temporaryDirectory = join(root, ".fixture-pack-check");
const fixtureNames = process.env.JACI_FIXTURE
  ? [process.env.JACI_FIXTURE]
  : ["vite", "react18", "react-router", "next", "remix", "tree-shaking"];
const suppliedTarball = process.env.JACI_TARBALL
  ? resolve(root, process.env.JACI_TARBALL)
  : undefined;

if (!suppliedTarball) {
  rmSync(artifactsDirectory, { force: true, recursive: true });
}
rmSync(temporaryDirectory, { force: true, recursive: true });
mkdirSync(temporaryDirectory, { recursive: true });

if (!suppliedTarball) {
  mkdirSync(artifactsDirectory, { recursive: true });
  execFileSync("pnpm", ["--filter", "jaci-ui", "pack", "--pack-destination", artifactsDirectory], {
    cwd: root,
    stdio: "inherit",
  });
}

const packedLibrary = suppliedTarball
  ? undefined
  : readdirSync(artifactsDirectory).find((file) => file.endsWith(".tgz"));
if (!packedLibrary) {
  if (!suppliedTarball) throw new Error("pnpm pack did not create a Jaci UI tarball");
}

const tarball = suppliedTarball ?? join(artifactsDirectory, packedLibrary);
if (!existsSync(tarball)) {
  throw new Error(`Jaci UI tarball does not exist: ${tarball}`);
}

for (const fixtureName of fixtureNames) {
  const source = join(root, "fixtures", fixtureName);
  const destination = join(temporaryDirectory, fixtureName);

  cpSync(source, destination, {
    recursive: true,
    filter: (path) => {
      const name = basename(path);
      return !["node_modules", "dist", ".next", "build", ".turbo", "coverage"].includes(name);
    },
  });

  const packageJsonPath = join(destination, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.dependencies["jaci-ui"] = "file:" + tarball;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

  execFileSync("pnpm", ["install", "--ignore-workspace", "--lockfile=false", "--prefer-offline"], {
    cwd: destination,
    stdio: "inherit",
  });
  execFileSync("pnpm", ["run", "check"], { cwd: destination, stdio: "inherit" });
  if (fixtureName === "react18") {
    execFileSync("pnpm", ["run", "typecheck:react18"], { cwd: destination, stdio: "inherit" });
    execFileSync("pnpm", ["run", "test:hydration"], { cwd: destination, stdio: "inherit" });
  }
  if (fixtureName === "remix") {
    execFileSync("pnpm", ["run", "typecheck"], { cwd: destination, stdio: "inherit" });
  }
}

if (!existsSync(tarball)) {
  throw new Error("Packed Jaci UI tarball was unexpectedly removed");
}

console.log("All packed-consumer fixtures passed.");
