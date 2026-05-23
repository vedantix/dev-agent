import { createPatch } from "diff";

export function generateDiff(
  fileName: string,
  original: string,
  updated: string
) {
  return createPatch(
    fileName,
    original,
    updated
  );
}