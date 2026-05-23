import { runAgent } from "../agent/agent.service";
import { generatePatch } from "./generate-patch.task";
import { savePatch } from "./save-patch.task";
import {
    parseGeneratedFiles
} from "../agent/patch-parser.service";

import { runGitWorkflow }
  from "./git-workflow.task";

import {
    writeGeneratedFiles
} from "../github/repository-writer.service";

export async function executeAgentTask() {
    const repoPath =
        "/Users/rishwi/Projects/provisioning-backend";

    const task = `
Fix de preview bug.

Controleer:
- Base44 URL discovery
- Preview routes
- Slug resolving
- Customer lookup

Zorg dat previews ook werken
voor toekomstige klanten.
`;

    const result =
        await runAgent(
            repoPath,
            task
        );

    const patch =
        await generatePatch(
            task,
            result.context
        );

    const files =
        parseGeneratedFiles(patch);

    console.log(
        `${files.length} bestanden gevonden`
    );

    await writeGeneratedFiles(
        repoPath,
        files
    );

    await runGitWorkflow(
        repoPath
      );

    await savePatch(patch);

    console.log("Patch opgeslagen");
}