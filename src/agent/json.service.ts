export function extractJson(
    content: string
  ): string {
  
    const start =
      content.indexOf("{");
  
    const end =
      content.lastIndexOf("}");
  
    if (
      start === -1 ||
      end === -1
    ) {
      throw new Error(
        "Geen JSON gevonden"
      );
    }
  
    return content.slice(
      start,
      end + 1
    );
  }