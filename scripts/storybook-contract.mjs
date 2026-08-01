import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const storiesRoot = join(root, "apps/storybook/src");
const componentsRoot = join(root, "packages/ui/src/components");
const stories = readdirSync(storiesRoot)
  .filter((file) => file.endsWith(".stories.tsx"))
  .sort();
const errors = [];

for (const file of stories) {
  const source = readFileSync(join(storiesRoot, file), "utf8");
  if (!source.includes('tags: ["autodocs')) errors.push(`${file}: missing Autodocs`);
  if (!/\btitle:\s*["`]/.test(source)) errors.push(`${file}: missing stable title`);
  if (!/\bcomponent:\s*[A-Za-z_$]/.test(source)) errors.push(`${file}: missing component metadata`);
  if (!/source:\s*\{[\s\S]*?code:/.test(source)) errors.push(`${file}: missing docs.source.code`);
}

for (const entry of readdirSync(componentsRoot)) {
  const path = join(componentsRoot, entry);
  if (statSync(path).isDirectory() && readdirSync(path).length === 0) {
    errors.push(`packages/ui/src/components/${entry}: empty component directory`);
  }
}

if (errors.length > 0) {
  throw new Error(`Storybook contract failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
}

console.log(`Storybook contract validated for ${stories.length} story files.`);
