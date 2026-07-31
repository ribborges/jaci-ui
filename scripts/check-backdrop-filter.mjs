import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageCss = join(root, "packages/ui/dist/styles.css");
const storybookAssets = join(root, "apps/storybook/storybook-static/assets");

const selectors = [
  ".jaci-dialog__backdrop",
  ".jaci-card__root",
  ".jaci-select__popup",
  ".jaci-menu__popup",
  ".jaci-toast__root",
  ".jaci-sidebar__root",
  ".jaci-bottomNavigation__root",
  ".jaci-popover__popup",
  ".jaci-date-picker__popup",
  ".jaci-date-range-picker__popup",
  ".jaci-drawer__backdrop",
  ".jaci-color-picker__popup",
  ".jaci-image__backdrop",
  ".jaci-figure__backdrop",
  ".jaci-combobox__popup",
  ".jaci-command__list",
  ".jaci-carousel__indicators",
  ".jaci-navbar__bar",
  ".jaci-navbar__drawerBackdrop",
  ".jaci-navbar__drawer",
];

function assertSourceRecipes() {
  const recipeFiles = [
    join(root, "packages/ui/src/styles/recipes.ts"),
    ...walk(join(root, "packages/ui/src/components")),
  ].filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));

  const violations = [];
  for (const file of recipeFiles) {
    const source = readFileSync(file, "utf8");
    if (/\bbackdropBlur\s*:|\bbackdropFilter\s*:/.test(source)) {
      violations.push(file);
    }
  }

  if (violations.length > 0) {
    throw new Error(
      `Recipes must use the shared backdrop helper instead of Panda backdrop properties:\n${violations.join("\n")}`,
    );
  }
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

function assertCss(file, label) {
  const css = readFileSync(file, "utf8");
  const missing = [];

  for (const selector of selectors) {
    const contexts = [];
    let searchFrom = 0;
    while (true) {
      const index = css.indexOf(selector, searchFrom);
      if (index === -1) break;
      contexts.push(css.slice(Math.max(0, index - 250), index + 1200));
      searchFrom = index + selector.length;
    }

    if (contexts.length === 0) {
      missing.push(`${selector} (selector missing)`);
      continue;
    }

    const block = contexts.join("\n");
    const hasStandard = /(?<!-)backdrop-filter\s*:/.test(block);
    const hasWebKit = /-webkit-backdrop-filter\s*:/.test(block);
    if (!hasStandard || !hasWebKit) {
      missing.push(`${selector} (standard=${hasStandard}, webkit=${hasWebKit})`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `${label} is missing compatible backdrop-filter declarations:\n${missing.join("\n")}`,
    );
  }

  const standardCount = (css.match(/(?<!-)backdrop-filter\s*:/g) ?? []).length;
  const webkitCount = (css.match(/-webkit-backdrop-filter\s*:/g) ?? []).length;
  console.log(`${label}: ${standardCount} standard, ${webkitCount} WebKit declarations`);
}

const packageOnly = process.argv.includes("--package-only");
assertSourceRecipes();

if (!existsSync(packageCss)) {
  throw new Error(`Package stylesheet not found: ${packageCss}`);
}
assertCss(packageCss, "jaci-ui/dist/styles.css");

if (!packageOnly) {
  if (!existsSync(storybookAssets)) {
    throw new Error(`Storybook assets directory not found: ${storybookAssets}`);
  }
  const cssFiles = readdirSync(storybookAssets)
    .filter((file) => file.endsWith(".css"))
    .map((file) => join(storybookAssets, file));
  if (cssFiles.length === 0) {
    throw new Error(`No Storybook CSS artifact found in ${storybookAssets}`);
  }
  for (const file of cssFiles) assertCss(file, `storybook/${file.split("/").pop()}`);
}
