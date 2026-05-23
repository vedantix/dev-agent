import fs from "fs/promises";
import path from "path";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".yml",
  ".yaml",
  ".md",
]);

export async function scanRepository(
  rootPath: string
): Promise<string[]> {
  const files: string[] = [];

  async function walk(
    currentDirectory: string
  ): Promise<void> {
    const entries = await fs.readdir(
      currentDirectory,
      {
        withFileTypes: true,
      }
    );

    for (const entry of entries) {
      if (
        IGNORED_DIRECTORIES.has(
          entry.name
        )
      ) {
        continue;
      }

      const absolutePath = path.join(
        currentDirectory,
        entry.name
      );

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      const extension =
        path.extname(entry.name);

      if (
        !ALLOWED_EXTENSIONS.has(
          extension
        )
      ) {
        continue;
      }

      files.push(
        path.relative(
          rootPath,
          absolutePath
        )
      );
    }
  }

  await walk(rootPath);

  return files.sort();
}