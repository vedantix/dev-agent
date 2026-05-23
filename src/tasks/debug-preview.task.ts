import { findRelevantFiles } from "./find-files.task";

export async function debugPreviewBug() {
  const files = await findRelevantFiles(
    "/Users/rishwi/Projects/provisioning-backend",
    `
Onderzoek waarom
/api/preview/:slug/html
een 404 of 500 retourneert.

Focus op:
- preview
- base44
- slug resolving
- customer lookup
`
  );

  console.log(files);
}