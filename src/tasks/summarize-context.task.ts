import { getOpenAI }
  from "../openai/openai.service";

export async function summarizeContext(
  context: string
) {
  const openai = getOpenAI();

  const response =
    await openai.responses.create({
      model: "gpt-5",
      input: `
Vat deze code samen.

Focus op:

- verantwoordelijkheden
- services
- routes
- bugs

${context}
`
    });

  return response.output_text;
}