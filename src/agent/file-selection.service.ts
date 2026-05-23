export function parseFileSelection(
    response: string
  ): string[] {
    const parsed = JSON.parse(response);
  
    return parsed.files || [];
  }