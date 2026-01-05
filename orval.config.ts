import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      client: "fetch",
      mode: "single",
      target: "./src/generated/api.ts",
      override: {
        mutator: {
          path: "./src/lib/http.ts",
          name: "customFetch",
        },
      },
    },
  },
});
