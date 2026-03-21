import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { portionsTable } from "../../db/schema";
import { notFound } from "../../shared/http-errors";
import { validationError } from "../../shared/validation-errors";
import {
  createPortionBodySchema,
  portionIdParamSchema,
  updatePortionBodySchema,
} from "./portion.schemas";

export const portionRoutes = new Hono();

portionRoutes.get("/", async (c) => {
  const portions = await db.select().from(portionsTable);
  return c.json(portions, 200);
});

portionRoutes.get(
  "/:id",
  zValidator("param", portionIdParamSchema, validationError("Invalid portion id")),
  async (c) => {
    const { id } = c.req.valid("param");
    const [portion] = await db.select().from(portionsTable).where(eq(portionsTable.id, id));

    if (!portion) {
      return notFound(c, "Portion not found");
    }

    return c.json(portion, 200);
  },
);

portionRoutes.post(
  "/",
  zValidator("json", createPortionBodySchema, validationError("Invalid portion payload")),
  async (c) => {
    const payload = c.req.valid("json");
    const [portion] = await db.insert(portionsTable).values(payload).returning();

    return c.json(portion, 201);
  },
);

portionRoutes.patch(
  "/:id",
  zValidator("param", portionIdParamSchema, validationError("Invalid portion id")),
  zValidator("json", updatePortionBodySchema, validationError("Invalid portion payload")),
  async (c) => {
    const payload = c.req.valid("json");
    const { id } = c.req.valid("param");

    const [portion] = await db
      .update(portionsTable)
      .set(payload)
      .where(eq(portionsTable.id, id))
      .returning();

    if (!portion) {
      return notFound(c, "Portion not found");
    }

    return c.json(portion, 200);
  },
);

portionRoutes.delete(
  "/:id",
  zValidator("param", portionIdParamSchema, validationError("Invalid portion id")),
  async (c) => {
    const { id } = c.req.valid("param");
    const [portion] = await db.select().from(portionsTable).where(eq(portionsTable.id, id));

    if (!portion) {
      return notFound(c, "Portion not found");
    }

    await db.delete(portionsTable).where(eq(portionsTable.id, id));
    return c.json({ message: "Portion deleted successfully" }, 200);
  },
);
