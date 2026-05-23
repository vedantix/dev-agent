export function buildFindFilesPrompt(
    task: string,
    files: string[]
  ) {
    return `
  Je bent een senior software architect.
  
  Taak:
  
  ${task}
  
  Repository bestanden:
  
  ${files.join("\n")}
  
  Return ALLEEN JSON:
  
  {
    "files": []
  }
  `;
  }