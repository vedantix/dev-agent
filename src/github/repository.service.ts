import fs from "fs/promises";
import path from "path";

export async function readFile(
  repoPath: string,
  relativePath: string
) {
  const filePath = path.join(repoPath, relativePath);

  return fs.readFile(filePath, "utf8");
}