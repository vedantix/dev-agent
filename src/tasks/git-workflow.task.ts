import {
    createBranch,
    commitChanges,
  } from "../github/git.service";
  
  import { AGENT_CONFIG }
    from "../config/agent.config";
  
  export async function runGitWorkflow(
    repoPath: string
  ) {
    const branch =
      `agent-${Date.now()}`;
  
    if (
      AGENT_CONFIG.git.createBranch
    ) {
      await createBranch(
        repoPath,
        branch
      );
  
      console.log(
        `Branch gemaakt: ${branch}`
      );
    }
  
    if (
      AGENT_CONFIG.git.commit
    ) {
      await commitChanges(
        repoPath,
        "feat(agent): generated patch"
      );
  
      console.log(
        "Commit gemaakt"
      );
    }
  }