import { describe, it, expect } from "bun:test";
import app from "./server";

describe("GET /", () => {
  it("should return 'API running'", async () => {
    const request = new Request("http://localhost:3000/");
    const response = await app.fetch(request);

    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toBe("API running");
  });
});
