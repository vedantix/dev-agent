import fs from "fs/promises";

import { getOpenAI } from "../openai/openai.service";
import { readFile } from "../github/repository.service";

export async function runTask() {
  const openai = getOpenAI();

  const financePage = await readFile(
    "/Users/rishwi/Projects/vedantix",
    "src/pages/admin/pages/FinancePage.jsx"
  );

  console.log("FinancePage geladen");
  console.log(financePage.substring(0, 500));

  const response = await openai.responses.create({
    model: "gpt-5",
    input: `
Analyseer dit bestand.

Geef:
1. Wat dit bestand doet
2. 5 verbeterpunten

${financePage}
`,
  });

  console.log(response.output_text);

  await fs.writeFile(
    "./output/analysis.txt",
    response.output_text,
    "utf8"
  );
}