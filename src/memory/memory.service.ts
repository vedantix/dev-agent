import fs from "fs/promises";
import path from "path";

import { AgentMemory }
  from "./memory.types";

const MEMORY_DIR =
  path.resolve("./memory");

export async function saveMemory(
  memory: AgentMemory
) {
  await fs.mkdir(
    MEMORY_DIR,
    { recursive: true }
  );

  const filename =
    `${memory.topic}.json`;

  await fs.writeFile(
    path.join(
      MEMORY_DIR,
      filename
    ),
    JSON.stringify(
      memory,
      null,
      2
    ),
    "utf8"
  );
}