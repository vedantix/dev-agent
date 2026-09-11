import dotenv from "dotenv";
import os from "node:os";

dotenv.config();

const apiUrl = (process.env.COMMAND_API_URL ?? "http://127.0.0.1:8180").replace(/\/+$/, "");
const agentId = process.env.WORKER_AGENT_ID ?? "";
const token = process.env.WORKER_AGENT_TOKEN ?? "";
const version = process.env.WORKER_VERSION ?? "1.1.0";
const hostname = process.env.WORKER_HOSTNAME ?? os.hostname();
const heartbeatMs = Number(process.env.WORKER_HEARTBEAT_MS ?? "30000");
const executionEnabled = (process.env.WORKER_EXECUTION_ENABLED ?? "false").toLowerCase() === "true";

if (!agentId || !token) {
  throw new Error("WORKER_AGENT_ID and WORKER_AGENT_TOKEN are required");
}

async function heartbeat() {
  const response = await fetch(`${apiUrl}/api/v1/worker-agents/${agentId}/heartbeat`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ hostname, version })
  });
  if (!response.ok) throw new Error(`Worker heartbeat failed with HTTP ${response.status}`);
}

async function tick() {
  try {
    await heartbeat();
    console.log(`[worker] heartbeat ok · ${hostname} · v${version} · execution=${executionEnabled}`);
    if (executionEnabled) {
      console.warn("[worker] task execution is enabled in configuration, but automatic task execution is intentionally not implemented yet.");
    }
  } catch (error) {
    console.error("[worker] heartbeat failed", error);
  }
}

async function bootstrap() {
  await tick();
  setInterval(() => void tick(), heartbeatMs);
}

void bootstrap();
