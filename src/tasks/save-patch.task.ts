import fs from "fs/promises";
import path from "path";

export async function savePatch(
  content: string
) {
  const outputDir =
    path.resolve("./output");

  await fs.mkdir(
    outputDir,
    { recursive: true }
  );

  await fs.writeFile(
    path.join(
      outputDir,
      "generated-patch.txt"
    ),
    content,
    "utf8"
  );
}