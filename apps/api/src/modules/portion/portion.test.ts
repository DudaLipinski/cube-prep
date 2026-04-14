import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { db } from "@/db";
import app from "@/server";

const originalInsert = db.insert;
const originalUpdate = db.update;
const originalDelete = db.delete;

beforeEach(() => {
  (db as any).insert = () => ({
    values: () => ({
      returning: async () => [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          created_at: new Date("2026-03-21T12:00:00.000Z"),
          name: "Rice cubes",
          type: "carb",
          quantity: 4,
          prepared_at: new Date("2026-03-21T10:00:00.000Z"),
        },
      ],
    }),
  });

  (db as any).update = () => ({
    set: () => ({
      where: () => ({
        returning: async () => [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            created_at: new Date("2026-03-21T12:00:00.000Z"),
            name: "Rice cubes",
            type: "carb",
            quantity: 2,
            prepared_at: new Date("2026-03-21T10:00:00.000Z"),
          },
        ],
      }),
    }),
  });

  (db as any).delete = () => ({
    where: () => ({
      returning: async () => [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
        },
      ],
    }),
  });
});

afterEach(() => {
  (db as any).insert = originalInsert;
  (db as any).update = originalUpdate;
  (db as any).delete = originalDelete;
});

describe("POST /portions", () => {
  it("should create a portion", async () => {
    const request = new Request("http://localhost:3000/portions", {
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
    const request = new Request("http://localhost:3000/portions", {
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

describe("PATCH /portions/:id", () => {
  it("should update a portion when quantity stays positive", async () => {
    const request = new Request(
      "http://localhost:3000/portions/123e4567-e89b-12d3-a456-426614174000",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          quantity: 2,
        }),
      },
    );

    const response = await app.fetch(request);
    const json = (await response.json()) as {
      id: string;
      quantity: number;
    };

    expect(response.status).toBe(200);
    expect(json.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(json.quantity).toBe(2);
  });

  it("should delete the portion when quantity is zero or less", async () => {
    const request = new Request(
      "http://localhost:3000/portions/123e4567-e89b-12d3-a456-426614174000",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          quantity: -3,
        }),
      },
    );

    const response = await app.fetch(request);
    const json = (await response.json()) as {
      message: string;
    };

    expect(response.status).toBe(200);
    expect(json.message).toBe("Portion deleted successfully");
  });
});
