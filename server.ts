import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { createRequestHandlerWithStaticFiles } from "@remix-run/deno";
// Import path interpreted by the Remix compiler
import * as build from "@remix-run/dev/server-build";

const remixHandler = createRequestHandlerWithStaticFiles({
  build,
  getLoadContext: () => ({
    // Add any custom load context properties you need here
  }),

  mode: build.mode,
});

const port = Number(Deno.env.get("PORT")) || 8000;
console.log(Deno.env.get("PORT"));
console.log(`Listening on http://localhost:${port}`);
serve(remixHandler, { port });
