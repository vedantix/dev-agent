import { findRelevantFiles } from "./find-files.task";
import { loadContext } from "./load-context.task";
import { analyzeCode } from "./analyze-code.task";

export async function debugTask() {
  const repoPath =
    "/Users/rishwi/Projects/provisioning-backend";

  const task = `
Waarom werkt
/api/preview/:slug/html
niet voor sommige klanten?
`;

  const files = await findRelevantFiles(
    repoPath,
    task
  );

  console.log("RELEVANTE BESTANDEN");
  console.log(files);

  const parsedFiles = files
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const context = await loadContext(
    repoPath,
    parsedFiles
  );

  const analysis = await analyzeCode(
    task,
    context
  );

  console.log(analysis);
}