import { readFile }
  from "./repository.service";

export async function loadContext(
  repoPath: string,
  files: string[]
): Promise<string> {

  const sections: string[] = [];

  for (const file of files) {

    const content =
      await readFile(
        repoPath,
        file
      );

    sections.push(
      `
FILE: ${file}

${content}
`
    );
  }

  return sections.join("\n\n");
}