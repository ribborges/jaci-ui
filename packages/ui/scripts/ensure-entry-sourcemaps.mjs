import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const packageRoot = new URL("../", import.meta.url).pathname;
const source = await readFile(join(packageRoot, "src/index.ts"), "utf8");

function identityMappings(lineCount) {
  if (lineCount === 0) return "";
  return ["AAAA", ...Array.from({ length: lineCount - 1 }, () => "AACA")].join(";");
}

for (const extension of ["js", "cjs"]) {
  const file = `index.${extension}`;
  const mapFile = `${file}.map`;
  const outputPath = join(packageRoot, "dist", file);
  const mapPath = join(packageRoot, "dist", mapFile);

  try {
    await access(mapPath);
    continue;
  } catch {
    // tsdown currently omits maps for the unbundled facade entries. Create a
    // valid identity map so every published runtime file has a source map.
  }

  const content = await readFile(outputPath, "utf8");
  const sourceMap = {
    version: 3,
    file,
    sources: ["../src/index.ts"],
    sourcesContent: [source],
    names: [],
    mappings: identityMappings(source.split("\n").length),
  };

  await writeFile(mapPath, `${JSON.stringify(sourceMap)}\n`);
  if (!content.includes(`//# sourceMappingURL=${mapFile}`)) {
    await writeFile(outputPath, `${content.trimEnd()}\n//# sourceMappingURL=${mapFile}\n`);
  }
}
