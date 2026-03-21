import { Hono } from "hono";
import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const helloQuerySchema = z.object({
  name: z.string(),
});

const validateHelloQuery = zValidator("query", helloQuerySchema);

app.get("/hello", validateHelloQuery, (c) => {
  const { name } = c.req.valid("query");
  return c.json({
    message: `Hello! ${name}`,
  });
});

export default app;
