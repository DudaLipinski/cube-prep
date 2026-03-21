import type { Context } from "hono";

export const notFound = (c: Context, message = "Resource not found") =>
  c.json(
    {
      error: "not_found",
      message,
      status: 404,
    },
    404,
  );
