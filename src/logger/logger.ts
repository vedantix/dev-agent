export function logStep(
    name: string,
    data?: unknown
  ) {
    console.log(
      `[AGENT] ${name}`
    );
  
    if (data) {
      console.dir(
        data,
        { depth: null }
      );
    }
  }