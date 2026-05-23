import { AgentStage, AgentContext }
  from "./agent.types";

export async function runStage(
  stage: AgentStage,
  context: AgentContext
) {
  console.log(
    `[${stage}]`
  );

  switch (stage) {
    case AgentStage.SCAN_REPOSITORY:
      break;

    case AgentStage.FIND_FILES:
      break;

    case AgentStage.LOAD_CONTEXT:
      break;

    case AgentStage.ANALYZE:
      break;

    case AgentStage.GENERATE_PATCH:
      break;

    default:
      break;
  }
}