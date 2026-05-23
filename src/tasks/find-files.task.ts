import { getOpenAI }
  from "../openai/openai.service";

export async function findRelevantFiles(
  task: string,
  files: string[]
): Promise<string[]> {

  const openai = getOpenAI();

  const response =
    await openai.responses.create({
      model: "gpt-5",
      input: `
Je bent een software architect.

Taak:

${task}

Bestanden:

${files.join("\n")}

Return ALLEEN JSON:

{
  "files": [
    "src/example.ts"
  ]
}
`
    });

  const json =
    JSON.parse(
      response.output_text
    );

  return json.files ?? [];
}