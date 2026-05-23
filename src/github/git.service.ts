import simpleGit from "simple-git";

export async function cloneOrPullRepo(path: string) {
  const git = simpleGit(path);

  await git.pull();

  return git;
}

export async function commitAndPush(
  repoPath: string,
  message: string,
) {
  const git = simpleGit(repoPath);

  await git.add(".");

  await git.commit(message);

  await git.push("origin", "main");
}

export async function getStatus(
  repoPath: string
) {
  const git = simpleGit(repoPath);

  return git.status();
}

export async function createBranch(
  repoPath: string,
  branchName: string
) {
  const git = simpleGit(repoPath);

  await git.checkoutLocalBranch(
    branchName
  );

  return branchName;
}

export async function commitChanges(
  repoPath: string,
  message: string
) {
  const git = simpleGit(repoPath);

  await git.add(".");

  await git.commit(message);
}