import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../dist/", import.meta.url).pathname;
const expectedClientModules = [
  "components/accordion/accordion.js",
  "components/alert-dialog/alert-dialog.js",
  "components/avatar/avatar.js",
  "components/button/button.js",
  "components/collapsible/collapsible.js",
  "components/combobox/combobox.js",
  "components/controls/checkbox.js",
  "components/controls/input.js",
  "components/controls/radio.js",
  "components/controls/switch.js",
  "components/controls/textarea.js",
  "components/icon-button/icon-button.js",
  "components/calendar/calendar.js",
  "components/date-picker/date-picker.js",
  "components/date-range-picker/date-range-picker.js",
  "components/dialog/dialog.js",
  "components/drawer/drawer.js",
  "components/context-menu/context-menu.js",
  "components/color-picker/color-picker.js",
  "components/checkbox-group/checkbox-group.js",
  "components/copyable/copyable.js",
  "components/command/command.js",
  "components/data-toolbar/data-toolbar.js",
  "components/menubar/menubar.js",
  "components/field/field.js",
  "components/fieldset/fieldset.js",
  "components/form/form.js",
  "components/menu/menu.js",
  "components/number-field/number-field.js",
  "components/navigation/navigation.js",
  "components/navigation-menu/navigation-menu.js",
  "components/option-selector/option-selector.js",
  "components/pagination/pagination.js",
  "components/pin-input/pin-input.js",
  "components/popover/popover.js",
  "components/radio-group/radio-group.js",
  "components/range-slider/range-slider.js",
  "components/select/select.js",
  "components/slider/slider.js",
  "components/sidebar/sidebar.js",
  "components/scroll-area/scroll-area.js",
  "components/tabs/tabs.js",
  "components/table/table.js",
  "components/tags-input/tags-input.js",
  "components/toast/toast.js",
  "components/tooltip/tooltip.js",
  "components/toggle/toggle.js",
  "components/toggle-group/toggle-group.js",
  "components/toolbar/toolbar.js",
  "components/tree-view/tree-view.js",
  "components/upload/upload.js",
  "theme/theme-provider.js",
];

const emittedFiles = new Set();

function collect(directory, relative = "") {
  if (!existsSync(directory)) {
    return;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const nextRelative = join(relative, entry.name);
    const nextPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      collect(nextPath, nextRelative);
    } else {
      emittedFiles.add(nextRelative);
    }
  }
}

collect(root);

const missing = expectedClientModules.filter((file) => !emittedFiles.has(file));
if (missing.length > 0) {
  throw new Error(`tsdown did not preserve the expected module structure: ${missing.join(", ")}`);
}

const withoutDirective = expectedClientModules.filter((file) => {
  const content = readFileSync(join(root, file), "utf8").trimStart();
  return !content.startsWith('"use client";') && !content.startsWith("'use client';");
});

if (withoutDirective.length > 0) {
  throw new Error(
    "The following interactive public modules lost their use client directive: " +
      withoutDirective.join(", "),
  );
}
