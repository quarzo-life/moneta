import { defineConfig } from "vitest/config";
import * as path from "node:path";

const root = import.meta.dirname as string;

// Mirrors the import map in `deno.jsonc` so vitest resolves the same aliases.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^mod$/, replacement: path.join(root, "mod.ts") },
      { find: /^messages$/, replacement: path.join(root, "src/messages.ts") },
      { find: /^api\//, replacement: path.join(root, "src/api") + "/" },
      { find: /^utils\//, replacement: path.join(root, "src/utils") + "/" },
      { find: /^divide\//, replacement: path.join(root, "src/divide") + "/" },
      { find: /^money\//, replacement: path.join(root, "src/money") + "/" },
      { find: /^types\//, replacement: path.join(root, "src/types") + "/" },
      { find: /^helpers\//, replacement: path.join(root, "src/helpers") + "/" },
      {
        find: /^currencies\//,
        replacement: path.join(root, "src/currencies") + "/",
      },
    ],
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*_test.ts"],
  },
});
