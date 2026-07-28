import { defineConfig } from "@pandacss/dev";

import {
  accordionRecipe,
  badgeRecipe,
  buttonRecipe,
  cardRecipe,
  collapsibleRecipe,
  controlRecipe,
  dialogRecipe,
  fieldRecipe,
  gridRecipe,
  headingRecipe,
  inputRecipe,
  linkRecipe,
  menuRecipe,
  navbarRecipe,
  paragraphRecipe,
  selectRecipe,
  separatorRecipe,
  sidebarRecipe,
  spinnerRecipe,
  stackRecipe,
  switchRecipe,
  tabsRecipe,
  textRecipe,
  textareaRecipe,
  toastRecipe,
  bottomNavigationRecipe,
} from "./src/styles/recipes";
import { alertRecipe } from "./src/components/alert/alert.recipe";
import { avatarRecipe } from "./src/components/avatar/avatar.recipe";
import { breadcrumbsRecipe } from "./src/components/breadcrumbs/breadcrumbs.recipe";
import { calendarRecipe } from "./src/components/calendar/calendar.recipe";
import { checkboxRecipe } from "./src/components/controls/checkbox.recipe";
import { checkboxGroupRecipe } from "./src/components/checkbox-group/checkbox-group.recipe";
import { datePickerRecipe } from "./src/components/date-picker/date-picker.recipe";
import { dateRangePickerRecipe } from "./src/components/date-range-picker/date-range-picker.recipe";
import { pinInputRecipe } from "./src/components/pin-input/pin-input.recipe";
import { drawerRecipe } from "./src/components/drawer/drawer.recipe";
import { menubarRecipe } from "./src/components/menubar/menubar.recipe";
import { paginationRecipe } from "./src/components/pagination/pagination.recipe";
import { popoverRecipe } from "./src/components/popover/popover.recipe";
import { progressKeyframes, progressRecipe } from "./src/components/progress/progress.recipe";
import { skeletonKeyframes, skeletonRecipe } from "./src/components/skeleton/skeleton.recipe";
import { tooltipRecipe } from "./src/components/tooltip/tooltip.recipe";
import { uploadRecipe } from "./src/components/upload/upload.recipe";
import { optionSelectorRecipe } from "./src/components/option-selector/option-selector.recipe";
import { fieldsetRecipe } from "./src/components/fieldset/fieldset.recipe";
import { formRecipe } from "./src/components/form/form.recipe";
import { visuallyHiddenRecipe } from "./src/components/visually-hidden/visually-hidden.recipe";
import { comboboxRecipe } from "./src/components/combobox/combobox.recipe";
import { numberFieldRecipe } from "./src/components/number-field/number-field.recipe";
import { radioGroupRecipe } from "./src/components/radio-group/radio-group.recipe";
import { sliderRecipe } from "./src/components/slider/slider.recipe";
import { colorPickerRecipe } from "./src/components/color-picker/color-picker.recipe";
import { dataViewRecipe } from "./src/components/data-view/data-view.recipe";
import { listRecipe } from "./src/components/list/list.recipe";
import { tableRecipe } from "./src/components/table/table.recipe";
import { copyableRecipe } from "./src/components/copyable/copyable.recipe";
import { scrollAreaRecipe } from "./src/components/scroll-area/scroll-area.recipe";
import { toggleGroupRecipe } from "./src/components/toggle-group/toggle-group.recipe";
import { toggleRecipe } from "./src/components/toggle/toggle.recipe";
import { toolbarRecipe } from "./src/components/toolbar/toolbar.recipe";
import { commandRecipe } from "./src/components/command/command.recipe";
import { meterRecipe } from "./src/components/meter/meter.recipe";
import { navigationMenuRecipe } from "./src/components/navigation-menu/navigation-menu.recipe";
import { rangeSliderRecipe } from "./src/components/range-slider/range-slider.recipe";
import { treeViewRecipe } from "./src/components/tree-view/tree-view.recipe";
import { tagsInputRecipe } from "./src/components/tags-input/tags-input.recipe";
import { iconButtonRecipe } from "./src/components/icon-button/icon-button.recipe";
import { buttonGroupRecipe } from "./src/components/button-group/button-group.recipe";
import { inputGroupRecipe } from "./src/components/input-group/input-group.recipe";
import { emptyStateRecipe } from "./src/components/empty-state/empty-state.recipe";
import { dataToolbarRecipe } from "./src/components/data-toolbar/data-toolbar.recipe";
import { stepperRecipe } from "./src/components/stepper/stepper.recipe";
import { codeRecipe } from "./src/components/code/code.recipe";
import { kbdRecipe } from "./src/components/kbd/kbd.recipe";
import { aspectRatioRecipe } from "./src/components/aspect-ratio/aspect-ratio.recipe";
import { imageRecipe } from "./src/components/image/image.recipe";
import { statRecipe } from "./src/components/stat/stat.recipe";
import { statGroupRecipe } from "./src/components/stat/stat-group.recipe";
import { figureRecipe } from "./src/components/figure/figure.recipe";
import { quoteRecipe } from "./src/components/quote/quote.recipe";
import { jaciConditions, jaciTheme } from "./src/styles/theme";

export default defineConfig({
  jsxFramework: "react",
  preflight: false,
  prefix: "jaci",
  hash: false,
  strictTokens: true,
  cssVarRoot: ":where(:root, [data-jaci-theme])",
  conditions: jaciConditions,
  include: ["./src/**/*.{ts,tsx}"],
  exclude: ["./src/styled-system/**/*", "**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
  outdir: "src/styled-system",
  outExtension: "js",
  theme: {
    ...jaciTheme,
    extend: {
      ...jaciTheme.extend,
      keyframes: {
        ...jaciTheme.extend.keyframes,
        ...progressKeyframes,
        ...skeletonKeyframes,
      },
      recipes: {
        heading: headingRecipe,
        text: textRecipe,
        paragraph: paragraphRecipe,
        link: linkRecipe,
        badge: badgeRecipe,
        layoutStack: stackRecipe,
        layoutGrid: gridRecipe,
        separator: separatorRecipe,
        spinner: spinnerRecipe,
        button: buttonRecipe,
        input: inputRecipe,
        textarea: textareaRecipe,
        control: controlRecipe,
        skeleton: skeletonRecipe,
        form: formRecipe,
        screenReaderOnly: visuallyHiddenRecipe,
        toggle: toggleRecipe,
        iconButton: iconButtonRecipe,
        code: codeRecipe,
        kbd: kbdRecipe,
        aspectRatioBox: aspectRatioRecipe,
        quote: quoteRecipe,
        statGroup: statGroupRecipe,
      },
      slotRecipes: {
        accordion: accordionRecipe,
        card: cardRecipe,
        collapsible: collapsibleRecipe,
        dialog: dialogRecipe,
        drawer: drawerRecipe,
        menubar: menubarRecipe,
        field: fieldRecipe,
        menu: menuRecipe,
        navbar: navbarRecipe,
        select: selectRecipe,
        sidebar: sidebarRecipe,
        tabs: tabsRecipe,
        toast: toastRecipe,
        bottomNavigation: bottomNavigationRecipe,
        toggleSwitch: switchRecipe,
        alert: alertRecipe,
        avatar: avatarRecipe,
        breadcrumbs: breadcrumbsRecipe,
        calendar: calendarRecipe,
        datePicker: datePickerRecipe,
        dateRangePicker: dateRangePickerRecipe,
        pinInput: pinInputRecipe,
        pagination: paginationRecipe,
        popover: popoverRecipe,
        progress: progressRecipe,
        tooltip: tooltipRecipe,
        upload: uploadRecipe,
        optionSelector: optionSelectorRecipe,
        fieldset: fieldsetRecipe,
        combobox: comboboxRecipe,
        checkbox: checkboxRecipe,
        checkboxGroup: checkboxGroupRecipe,
        numberField: numberFieldRecipe,
        radioGroup: radioGroupRecipe,
        slider: sliderRecipe,
        colorPicker: colorPickerRecipe,
        dataView: dataViewRecipe,
        list: listRecipe,
        table: tableRecipe,
        copyable: copyableRecipe,
        scrollArea: scrollAreaRecipe,
        toggleGroup: toggleGroupRecipe,
        toolbar: toolbarRecipe,
        command: commandRecipe,
        meter: meterRecipe,
        navigationMenu: navigationMenuRecipe,
        rangeSlider: rangeSliderRecipe,
        treeView: treeViewRecipe,
        tagsInput: tagsInputRecipe,
        buttonGroup: buttonGroupRecipe,
        inputGroup: inputGroupRecipe,
        emptyState: emptyStateRecipe,
        dataToolbar: dataToolbarRecipe,
        stepper: stepperRecipe,
        image: imageRecipe,
        stat: statRecipe,
        figure: figureRecipe,
      },
    },
  },
  staticCss: {
    recipes: "*",
  },
  globalCss: {
    ':where([data-slot="bottom-navigation"])': { display: "flex" },
    ':where([data-slot="sidebar"])': { display: "flex" },
    "@media (prefers-reduced-motion: reduce)": {
      "[data-jaci-component], [data-jaci-component] *": {
        animationDuration: "0ms",
        animationIterationCount: "1",
        scrollBehavior: "auto",
        transitionDuration: "0ms",
      },
    },
    "[data-jaci-theme]": {
      backgroundColor: "surface.canvas",
      color: "fg.default",
      colorScheme: "light dark",
      fontFamily: "system-ui, sans-serif",
    },
  },
});
