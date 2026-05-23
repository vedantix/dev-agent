const repositoryCache =
  new Map<string, string[]>();

export function getCachedFiles(
  repoPath: string
) {
  return repositoryCache.get(
    repoPath
  );
}

export function setCachedFiles(
  repoPath: string,
  files: string[]
) {
  repositoryCache.set(
    repoPath,
    files
  );
}