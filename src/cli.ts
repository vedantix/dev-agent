import dotenv from "dotenv";
import { executeAgent } from "./agent/agent.service";

dotenv.config();

async function bootstrap() {
  const repoPath = process.env.DEV_AGENT_REPO_PATH;
  const task = process.env.DEV_AGENT_TASK;
  if (!repoPath || !task) throw new Error("DEV_AGENT_REPO_PATH and DEV_AGENT_TASK are required");
  const result = await executeAgent({ repoPath, task });
  console.log(JSON.stringify(result, null, 2));
}

void bootstrap().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
