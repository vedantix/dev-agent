export enum AgentStage {
    SCAN_REPOSITORY = "SCAN_REPOSITORY",
    FIND_FILES = "FIND_FILES",
    LOAD_CONTEXT = "LOAD_CONTEXT",
    ANALYZE = "ANALYZE",
    GENERATE_PATCH = "GENERATE_PATCH",
    PARSE_PATCH = "PARSE_PATCH",
    WRITE_FILES = "WRITE_FILES",
    GIT_BRANCH = "GIT_BRANCH",
    GIT_COMMIT = "GIT_COMMIT",
    GIT_PUSH = "GIT_PUSH",
  }
  
  export interface AgentContext {
    task: string;
    repoPath: string;
  
    files: string[];
    context: string;
  
    analysis?: string;
    patch?: string;
  }