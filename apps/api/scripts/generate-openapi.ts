import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import app from "../src/server";

const outputUrl = new URL("../openapi.json", import.meta.url);

const document = app.getOpenAPIDocument({
  openapi: "3.0.0",
  info: {
    title: "Cube Prep API",
    version: "1.0.0",
  },
});

await writeFile(outputUrl, `${JSON.stringify(document, null, 2)}\n`, "utf8");

console.log(`OpenAPI schema written to ${fileURLToPath(outputUrl)}`);
