import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { db } from "../../db";
import app from "../../server";

const originalInsert = db.insert;

beforeEach(() => {
  (db as any).insert = () => ({
    values: () => ({
      returning: async () => [
        {
          id: "00000000-0000-0000-0000-000000000001",
          created_at: new Date("2026-03-21T12:00:00.000Z"),
          name: "Rice cubes",
          type: "carb",
          quantity: 4,
          prepared_at: new Date("2026-03-21T10:00:00.000Z"),
        },
      ],
    }),
  });
});

afterEach(() => {
  (db as any).insert = originalInsert;
});

describe("POST /portion", () => {
  it("should create a portion", async () => {
    const request = new Request("http://localhost:3000/portion", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Rice cubes",
        type: "carb",
        quantity: 4,
        prepared_at: "2026-03-21T10:00:00.000Z",
      }),
    });

    const response = await app.fetch(request);
    const json = (await response.json()) as {
      id: string;
      created_at: string;
      name: string;
      type: string;
      quantity: number;
    };

    expect(response.status).toBe(201);
    expect(json.id).toBeString();
    expect(json.created_at).toBeString();
    expect(json.name).toBe("Rice cubes");
    expect(json.type).toBe("carb");
    expect(json.quantity).toBe(4);
  });

  it("should reject invalid type", async () => {
    const request = new Request("http://localhost:3000/portion", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Mystery",
        type: "dessert",
        quantity: 1,
        prepared_at: "2026-03-21T10:00:00.000Z",
      }),
    });

    const response = await app.fetch(request);

    expect(response.status).toBe(400);
  });
});
