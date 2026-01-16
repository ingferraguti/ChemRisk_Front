import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./openapi_TOBE.yaml",
    },
    output: {
      client: "fetch",
      mode: "single",
      target: "./src/generated/api.ts",
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: "./src/lib/http.ts",
          name: "customFetch",
        },
      },
    },
  },
});
