import path from "path";

import { readFile } from "../github/repository.service";
import { writeFile } from "../files/file.service";
import { generateCode } from "../openai/code-generator.service";
import { generateDiff } from "../github/diff.service";

export async function generateFinancePage() {
  const sourceCode = await readFile(
    "/Users/rishwi/Projects/vedantix",
    "src/pages/admin/pages/FinancePage.jsx"
  );

  const updatedCode = await generateCode(
    `
Voeg een Stripe ARR KPI toe.

ARR = MRR * 12.

Gebruik bestaande styling.
`,
    sourceCode
  );

  const diff = generateDiff(
    "FinancePage.jsx",
    sourceCode,
    updatedCode
  );

  console.log(diff);

  await writeFile(
    path.resolve("./output/FinancePage.generated.jsx"),
    updatedCode
  );

  await writeFile(
    path.resolve("./output/FinancePage.diff.txt"),
    diff
  );
}