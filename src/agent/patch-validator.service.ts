import { GeneratedPatch }
  from "./patch.types";

export function validatePatch(
  patch: GeneratedPatch
) {

  if (
    !patch.files ||
    !Array.isArray(
      patch.files
    )
  ) {
    throw new Error(
      "Geen files array"
    );
  }

  for (
    const file
    of patch.files
  ) {
    if (!file.path) {
      throw new Error(
        "File path ontbreekt"
      );
    }

    if (!file.content) {
      throw new Error(
        `Lege content: ${file.path}`
      );
    }
  }
}