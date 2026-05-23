import fs from "fs/promises";
import path from "path";

import { GeneratedPatch }
  from "../agent/patch.types";

import { AGENT_CONFIG }
  from "../config/agent.config";

export async function writeToSandbox(
  patch: GeneratedPatch
) {

  for (
    const file
    of patch.files
  ) {

    const fullPath =
      path.join(
        AGENT_CONFIG.sandboxPath,
        file.path
      );

    await fs.mkdir(
      path.dirname(
        fullPath
      ),
      { recursive: true }
    );

    await fs.writeFile(
      fullPath,
      file.content,
      "utf8"
    );
  }
}