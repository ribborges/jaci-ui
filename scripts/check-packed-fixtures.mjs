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
const fixtureNames = ["vite", "react18", "react-router", "next"];

rmSync(artifactsDirectory, { force: true, recursive: true });
rmSync(temporaryDirectory, { force: true, recursive: true });
mkdirSync(artifactsDirectory, { recursive: true });
mkdirSync(temporaryDirectory, { recursive: true });

execFileSync("pnpm", ["--filter", "jaci-ui", "pack", "--pack-destination", artifactsDirectory], {
  cwd: root,
  stdio: "inherit",
});

const packedLibrary = readdirSync(artifactsDirectory).find((file) => file.endsWith(".tgz"));
if (!packedLibrary) {
  throw new Error("pnpm pack did not create a Jaci UI tarball");
}

const tarball = join(artifactsDirectory, packedLibrary);

for (const fixtureName of fixtureNames) {
  const source = join(root, "fixtures", fixtureName);
  const destination = join(temporaryDirectory, fixtureName);

  cpSync(source, destination, {
    recursive: true,
    filter: (path) => {
      const name = basename(path);
      return !["node_modules", "dist", ".next", "coverage"].includes(name);
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
  }
}

if (!existsSync(tarball)) {
  throw new Error("Packed Jaci UI tarball was unexpectedly removed");
}

console.log("All packed-consumer fixtures passed.");
