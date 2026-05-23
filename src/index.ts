import dotenv from "dotenv";

dotenv.config();

import { executeAgent }
  from "./agent/agent.service";

async function bootstrap() {

  const result =
    await executeAgent({
      repoPath:
        "/Users/rishwi/Projects/provisioning-backend",

      task: `
Waarom werkt
/api/preview/:slug/html
niet voor sommige klanten?

Zorg dat previews ook
voor toekomstige klanten werken.
`
    });

  console.log(
    result.selectedFiles
  );

  console.log(
    result.analysis
  );
}

bootstrap().catch(console.error);