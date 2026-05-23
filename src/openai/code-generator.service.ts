import { getOpenAI } from "./openai.service";

export async function generateCode(
  instruction: string,
  sourceCode: string
): Promise<string> {
  const openai = getOpenAI();

  const response = await openai.responses.create({
    model: "gpt-5",
    input: `
Je bent een senior software engineer.

Voer onderstaande wijziging uit:

${instruction}

Geef uitsluitend de volledige gewijzigde code terug.

Broncode:

${sourceCode}
`,
  });

  return response.output_text;
}