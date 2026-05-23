import { GeneratedPatch } from "./patch.types";

export function extractJson(
  content: string
): string {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error(
      "Geen JSON payload gevonden in GPT response."
    );
  }

  return content.slice(
    start,
    end + 1
  );
}

export function parsePatch(
  response: string
): GeneratedPatch {
  try {
    const json =
      extractJson(response);

    const patch =
      JSON.parse(json) as GeneratedPatch;

    validatePatch(patch);

    return patch;
  } catch (error) {
    console.error(
      "Patch parsing mislukt:",
      error
    );

    throw error;
  }
}

export function validatePatch(
  patch: GeneratedPatch
): void {
  if (
    !patch ||
    !Array.isArray(patch.files)
  ) {
    throw new Error(
      "Patch bevat geen geldige files array."
    );
  }

  for (const file of patch.files) {
    if (
      !file.path ||
      typeof file.path !== "string"
    ) {
      throw new Error(
        "Bestand bevat geen geldig pad."
      );
    }

    if (
      typeof file.content !== "string"
    ) {
      throw new Error(
        `Bestand ${file.path} bevat geen geldige content.`
      );
    }
  }
}