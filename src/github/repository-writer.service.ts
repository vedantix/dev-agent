import fs from "fs/promises";
import path from "path";

import { GeneratedPatch } from "../agent/patch.types";
import { AGENT_CONFIG } from "../config/agent.config";

export async function writePatch(
  repoPath: string,
  patch: GeneratedPatch
) {
  for (const file of patch.files) {
    const fullPath = path.join(
      repoPath,
      file.path
    );

    if (AGENT_CONFIG.dryRun) {
      console.log(
        `[DRY RUN] ${file.path}`
      );

      continue;
    }

    await fs.mkdir(
      path.dirname(fullPath),
      { recursive: true }
    );

    await fs.writeFile(
      fullPath,
      file.content,
      "utf8"
    );

    console.log(
      `[UPDATED] ${file.path}`
    );
  }
}