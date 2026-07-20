import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "panda-preset": "src/panda-preset.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  unbundle: true,
  platform: "neutral",
  target: "es2022",
  clean: true,
  deps: {
    neverBundle: ["react", "react-dom", "react/jsx-runtime"],
  },
});
