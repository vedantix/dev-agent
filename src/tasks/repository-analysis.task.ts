import { getOpenAI } from "../openai/openai.service";
import { scanRepository } from "../github/repository-scanner.service";

export async function analyzeRepository() {
  const files = await scanRepository(
    "/Users/rishwi/Projects/provisioning-backend"
  );

  const openai = getOpenAI();

  const response = await openai.responses.create({
    model: "gpt-5",
    input: `
Analyseer deze repository structuur.

Welke bestanden zijn waarschijnlijk relevant voor:

1. Preview functionaliteit
2. Base44 integratie
3. Klantenbeheer

Repository bestanden:

${files.join("\n")}
`,
  });

  console.log(response.output_text);
}