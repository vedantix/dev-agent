import { getOpenAI }
  from "../openai/openai.service";

export async function generatePatch(
  task: string,
  context: string
): Promise<string> {

  const openai = getOpenAI();

  const response =
    await openai.responses.create({
      model: "gpt-5",
      input: `
Je bent een senior software engineer.

Voer deze taak uit:

${task}

Code context:

${context}

Return ALLEEN JSON.

Voorbeeld:

{
  "files": [
    {
      "path":
        "src/example.ts",
      "content":
        "volledige code"
    }
  ]
}
`
    });

  return response.output_text;
}