import { readFile } from "../github/repository.service";

export async function loadContext(
  repoPath: string,
  files: string[]
) {
  const context: string[] = [];

  for (const file of files.slice(0, 10)) {
    try {
      const content = await readFile(
        repoPath,
        file.replace(`${repoPath}/`, "")
      );

      context.push(`
FILE: ${file}

${content}
`);
    } catch {
      continue;
    }
  }

  return context.join("\n\n");
}