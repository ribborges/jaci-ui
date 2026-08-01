import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceIndex = join(root, "packages/ui/src/index.ts");
const snapshotPath = join(root, "docs/api-contract/coverage.json");
const update = process.argv.includes("--update");
const strict = process.argv.includes("--strict");

const storyOverrides = {
  "button-group": "high-reuse.stories.tsx",
  collapsible: "accordion.stories.tsx",
  controls: "forms.stories.tsx",
  "empty-state": "high-reuse.stories.tsx",
  feedback: "high-reuse.stories.tsx",
  field: "forms.stories.tsx",
  layout: "layout.stories.tsx",
  "icon-button": "high-reuse.stories.tsx",
  "input-group": "high-reuse.stories.tsx",
  navigation: "navbar.stories.tsx",
  spacer: "separator-spacer.stories.tsx",
  stat: "stat.stories.tsx",
  "stat-group": "stat.stories.tsx",
  theme: "theme-provider.stories.tsx",
  typography: "typography.stories.tsx",
  "toggle-group": "toggle.stories.tsx",
  "visually-hidden": "high-reuse.stories.tsx",
};

const testOverrides = {
  controls: "packages/ui/src/public-api-contract.test.tsx",
  feedback: "packages/ui/src/components/feedback/feedback.test.tsx",
  layout: "packages/ui/src/components/layout/layout.test.tsx",
  navigation: "packages/ui/src/public-api-contract.test.tsx",
  "stat-group": "packages/ui/src/components/stat-group/stat-group.test.tsx",
  theme: "packages/ui/src/theme/theme-provider.test.tsx",
  typography: "packages/ui/src/components/typography/typography.test.tsx",
};

const directTestOverrides = new Set(["feedback", "layout", "stat-group", "theme", "typography"]);

const interactiveModules = new Set([
  "accordion",
  "alert-dialog",
  "button",
  "button-group",
  "calendar",
  "carousel",
  "checkbox-group",
  "collapsible",
  "combobox",
  "controls",
  "copyable",
  "command",
  "color-picker",
  "date-picker",
  "date-range-picker",
  "dialog",
  "drawer",
  "field",
  "fieldset",
  "figure",
  "form",
  "image",
  "input-group",
  "menu",
  "menubar",
  "navigation",
  "navigation-menu",
  "number-field",
  "option-selector",
  "pagination",
  "pin-input",
  "popover",
  "radio-group",
  "range-slider",
  "select",
  "sidebar",
  "stepper",
  "table",
  "tags-input",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "tree-view",
  "upload",
  "theme",
]);

const statefulModules = new Set([
  "accordion",
  "alert-dialog",
  "button",
  "calendar",
  "carousel",
  "checkbox-group",
  "collapsible",
  "combobox",
  "controls",
  "copyable",
  "command",
  "color-picker",
  "date-picker",
  "date-range-picker",
  "dialog",
  "drawer",
  "field",
  "fieldset",
  "form",
  "image",
  "menu",
  "menubar",
  "navigation",
  "navigation-menu",
  "number-field",
  "option-selector",
  "pagination",
  "pin-input",
  "popover",
  "radio-group",
  "range-slider",
  "select",
  "sidebar",
  "stepper",
  "table",
  "tags-input",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "tree-view",
  "upload",
]);

function moduleName(path) {
  return path.replace(/^\.\/components\//, "");
}

function defaultStory(name) {
  return `${name}.stories.tsx`;
}

function defaultTest(name) {
  return `packages/ui/src/components/${name}/${name}.test.tsx`;
}

function createCoverage() {
  const source = readFileSync(sourceIndex, "utf8");
  const modules = [...source.matchAll(/export \* from ["'](\.\/components\/[^"']+)["'];/g)]
    .map((match) => moduleName(match[1]))
    .sort((a, b) => a.localeCompare(b));

  const entries = modules.map((name) => {
    const defaultTestPath = defaultTest(name);
    const hasDirectTest = existsSync(join(root, defaultTestPath)) || directTestOverrides.has(name);
    const test = hasDirectTest
      ? directTestOverrides.has(name)
        ? testOverrides[name]
        : defaultTestPath
      : (testOverrides[name] ?? "packages/ui/src/public-api-contract.test.tsx");
    const storyFile = storyOverrides[name] ?? defaultStory(name);
    const story = `apps/storybook/src/${storyFile}`;
    const interactive = interactiveModules.has(name);
    const stateful = statefulModules.has(name);
    return {
      module: `components/${name}`,
      test,
      verification: hasDirectTest ? "direct-test" : "api-smoke-test",
      story,
      capabilities: {
        render: "required",
        controlled: interactive ? "required" : "not-applicable",
        keyboard: interactive ? "required" : "not-applicable",
        disabled: stateful ? "required" : "not-applicable",
        invalid: [
          "controls",
          "field",
          "fieldset",
          "form",
          "select",
          "combobox",
          "date-picker",
          "date-range-picker",
          "pin-input",
          "upload",
        ].includes(name)
          ? "required"
          : "not-applicable",
        loading: stateful ? "required" : "not-applicable",
        ssr: "required",
        hydration: interactive ? "required" : "not-applicable",
        storybook: "required",
        accessibility: "required",
      },
    };
  });

  return { version: "0.9.1", entries };
}

const coverage = createCoverage();
if (update || !existsSync(snapshotPath)) {
  mkdirSync(join(root, "docs/api-contract"), { recursive: true });
  writeFileSync(snapshotPath, `${JSON.stringify(coverage, null, 2)}\n`);
  console.log(`${update ? "Updated" : "Created"} docs/api-contract/coverage.json`);
} else {
  const expected = JSON.parse(readFileSync(snapshotPath, "utf8"));
  if (JSON.stringify(expected) !== JSON.stringify(coverage)) {
    throw new Error(
      "The public test coverage matrix changed. Review it and run pnpm coverage:contract:update.",
    );
  }
}

const missing = coverage.entries.flatMap((entry) =>
  [entry.test, entry.story].filter((file) => !existsSync(join(root, file))),
);
if (missing.length > 0) {
  throw new Error(`Coverage matrix references missing files: ${missing.join(", ")}`);
}

if (strict) {
  const unverifiedInteractiveModules = coverage.entries
    .filter(
      (entry) =>
        interactiveModules.has(entry.module.replace("components/", "")) &&
        entry.verification !== "direct-test",
    )
    .map((entry) => entry.module);
  if (unverifiedInteractiveModules.length > 0) {
    throw new Error(
      `Interactive modules require direct behavior tests before release: ${unverifiedInteractiveModules.join(
        ", ",
      )}`,
    );
  }
}

console.log(`Coverage matrix validated for ${coverage.entries.length} public modules.`);
