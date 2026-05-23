import { AgentRequest } from "./agent-request";
import { AgentResponse } from "./agent-response";

import { scanRepository } from "../github/repository-scanner.service";
import { loadContext } from "../github/context-loader.service";
import { writePatch } from "../github/repository-writer.service";

import { findRelevantFiles } from "../tasks/find-files.task";
import { analyzeCode } from "../tasks/analyze-code.task";
import { generatePatch } from "../tasks/generate-patch.task";

import { parsePatch } from "./patch-parser.service";
import { validatePatch } from "./patch-validator.service";

export async function executeAgent(
  request: AgentRequest
): Promise<AgentResponse> {
  console.log("====================================");
  console.log("VEDANTIX DEV AGENT");
  console.log("====================================");
  console.log(`Task: ${request.task}`);
  console.log(`Repository: ${request.repoPath}`);
  console.log("");

  try {
    console.log("[1/6] Repository scannen...");

    const repositoryFiles = await scanRepository(
      request.repoPath
    );

    console.log(
      `Repository bevat ${repositoryFiles.length} bestanden`
    );

    console.log("");
    console.log("[2/6] Relevante bestanden selecteren...");

    const selectedFiles = await findRelevantFiles(
      request.task,
      repositoryFiles
    );

    console.log(
      `${selectedFiles.length} relevante bestanden gevonden`
    );

    selectedFiles.forEach((file) =>
      console.log(` - ${file}`)
    );

    console.log("");
    console.log("[3/6] Context laden...");

    const context = await loadContext(
      request.repoPath,
      selectedFiles
    );

    console.log(
      `Context geladen (${context.length} karakters)`
    );

    console.log("");
    console.log("[4/6] Code analyseren...");

    const analysis = await analyzeCode(
      request.task,
      context
    );

    console.log("Analyse voltooid");

    console.log("");
    console.log("[5/6] Patch genereren...");

    const patchResponse = await generatePatch(
      request.task,
      context
    );

    const patch = parsePatch(
      patchResponse
    );

    validatePatch(
      patch
    );

    console.log(
      `${patch.files.length} bestanden in patch gevonden`
    );

    patch.files.forEach((file) =>
      console.log(` - ${file.path}`)
    );

    console.log("");
    console.log("[6/6] Patch toepassen...");

    await writePatch(
      request.repoPath,
      patch
    );

    console.log("");
    console.log("Agent succesvol afgerond");

    return {
      selectedFiles,
      analysis,
      patchGenerated: true,
    };
  } catch (error) {
    console.error("");
    console.error("Agent execution failed");
    console.error(error);

    throw error;
  }
}