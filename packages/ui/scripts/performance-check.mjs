import { readFile } from "node:fs/promises";
import { brotliCompressSync, gzipSync } from "node:zlib";

const packageRoot = new URL("../", import.meta.url).pathname;
const budget = JSON.parse(
  await readFile(new URL("../performance-budget.json", import.meta.url), "utf8"),
);

const metrics = {
  raw: (data) => data.length,
  gzip: (data) => gzipSync(data).length,
  brotli: (data) => brotliCompressSync(data).length,
};

const failures = [];
const report = [];

for (const [relativePath, baseline] of Object.entries(budget.artifacts)) {
  const data = await readFile(new URL(relativePath, `file://${packageRoot}`));

  for (const [metric, measure] of Object.entries(metrics)) {
    const actual = measure(data);
    const limit = Math.ceil(baseline[metric] * (1 + budget.headroom));
    report.push({ file: relativePath, metric, actual, limit });

    if (actual > limit) {
      failures.push(`${relativePath} ${metric}: ${actual} bytes > ${limit} byte limit`);
    }
  }
}

console.table(report);

if (failures.length > 0) {
  throw new Error(
    `Performance budgets exceeded:\n${failures.map((failure) => `- ${failure}`).join("\n")}`,
  );
}

console.log(`Performance budgets passed with ${budget.headroom * 100}% headroom.`);
