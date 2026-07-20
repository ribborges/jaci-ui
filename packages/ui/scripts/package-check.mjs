import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const packageRoot = new URL("../", import.meta.url).pathname;
const packageJson = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
const destination = await mkdtemp(join(tmpdir(), "jaci-ui-package-check-"));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: packageRoot, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with ${signal ?? `code ${code}`}`));
    });
  });
}

try {
  await run(pnpm, ["pack", "--pack-destination", destination]);

  const tarballName = (await readdir(destination)).find((file) => file.endsWith(".tgz"));
  if (!tarballName) {
    throw new Error("pnpm pack did not produce a tarball");
  }

  const tarball = join(destination, tarballName);
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
} finally {
  await rm(destination, { force: true, recursive: true });
}

console.log(`${packageJson.name} package validation completed.`);
