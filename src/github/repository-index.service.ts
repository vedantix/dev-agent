import fs from "fs/promises";
import path from "path";

export interface RepositoryFile {
  path: string;
  size: number;
}

export async function buildRepositoryIndex(
  rootPath: string,
  files: string[]
): Promise<RepositoryFile[]> {
  const result: RepositoryFile[] = [];

  for (const file of files) {
    const stats = await fs.stat(
      path.join(rootPath, file)
    );

    result.push({
      path: file,
      size: stats.size,
    });
  }

  return result;
}