import { getOpenAI } from "../openai/openai.service";

export async function analyzeCode(
  task: string,
  context: string
) {
  const openai = getOpenAI();

  const response = await openai.responses.create({
    model: "gpt-5",
    input: `
Je bent een senior software architect.

Taak:

${task}

Repository context:

${context}

Analyseer:

1. Waarschijnlijke oorzaak
2. Betrokken bestanden
3. Gewenste wijziging
4. Concrete code-aanpak

Geef een technisch rapport.
`,
  });

  return response.output_text;
}