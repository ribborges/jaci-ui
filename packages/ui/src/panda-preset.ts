import { definePreset } from "@pandacss/dev";

import { jaciConditions, jaciTheme } from "./styles/theme";

const jaciPreset = definePreset({
  name: "jaci-ui",
  conditions: jaciConditions,
  theme: jaciTheme,
});

export default jaciPreset;
