import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const tarballInput = process.argv[2] ?? process.env.JACI_TARBALL;
if (!tarballInput) {
  throw new Error("Pass the packed Jaci UI tarball as the first argument or JACI_TARBALL");
}

const tarball = resolve(process.cwd(), tarballInput);
const directory = mkdtempSync(join(tmpdir(), "jaci-ui-node18-consumer-"));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(command, args) {
  execFileSync(command, args, { cwd: directory, stdio: "inherit" });
}

try {
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify(
      {
        name: "jaci-ui-node18-consumer",
        private: true,
        type: "module",
        dependencies: {
          "jaci-ui": `file:${tarball}`,
          react: "18.3.1",
          "react-dom": "18.3.1",
        },
        devDependencies: {
          "@types/react": "^18.3.18",
          "@types/react-dom": "^18.3.5",
          typescript: "^5.7.3",
        },
      },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    join(directory, "consumer.tsx"),
    `import { Button, Heading, Stack } from "jaci-ui";

export function Consumer() {
  return <Stack><Heading as="h1">Node 18 consumer</Heading><Button>Ready</Button></Stack>;
}
`,
  );
  writeFileSync(
    join(directory, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          esModuleInterop: true,
          jsx: "react-jsx",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          noEmit: true,
          skipLibCheck: true,
          strict: true,
          target: "ES2022",
        },
        include: ["consumer.tsx"],
      },
      null,
      2,
    ) + "\n",
  );

  run(pnpm, ["install", "--ignore-workspace", "--lockfile=false", "--prefer-offline"]);
  run(pnpm, ["exec", "tsc", "--noEmit"]);
  run(process.execPath, [
    "--input-type=module",
    "--eval",
    `import { createRequire } from "node:module";
import * as React from "react";
import { renderToString } from "react-dom/server";
const esm = await import("jaci-ui");
const cjs = createRequire(import.meta.url)("jaci-ui");
if (!esm.Button || !cjs.Button) throw new Error("ESM/CJS Button exports are unavailable");
const html = renderToString(React.createElement(esm.Button, null, "SSR"));
if (!html.includes("SSR")) throw new Error("React 18 SSR did not render Jaci UI");
console.log("Node 18 ESM, CJS, types and SSR checks passed.");`,
  ]);
} finally {
  rmSync(directory, { force: true, recursive: true });
}
