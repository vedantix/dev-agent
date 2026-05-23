import { GeneratedPatch }
  from "../agent/patch.types";

export async function runDryRun(
  patch: GeneratedPatch
) {

  console.log(
    "\n=== PATCH ===\n"
  );

  for (
    const file
    of patch.files
  ) {
    console.log(
      file.path
    );

    console.log(
      file.content
        .substring(0, 300)
    );

    console.log(
      "\n-----------------\n"
    );
  }
}