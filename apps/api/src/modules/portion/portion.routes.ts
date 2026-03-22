import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { portionsTable } from "../../db/schema";
import { validationError } from "../../shared/validation-errors";
import {
  createPortionBodySchema,
  deleteSuccessSchema,
  notFoundErrorSchema,
  portionResponseSchema,
  portionIdParamSchema,
  updatePortionBodySchema,
  validationErrorSchema,
} from "./portion.schemas";

const notFoundPortion = {
  error: "not_found" as const,
  message: "Portion not found",
  status: 404 as const,
};

const toPortionResponse = (portion: typeof portionsTable.$inferSelect) => ({
  ...portion,
  prepared_at: portion.prepared_at.toISOString(),
  created_at: portion.created_at.toISOString(),
});

export const portionRoutes = new OpenAPIHono({
  defaultHook: validationError("Validation failed"),
});

portionRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Portion"],
    responses: {
      200: {
        description: "List portions",
        content: {
          "application/json": {
            schema: portionResponseSchema.array(),
          },
        },
      },
    },
  }),
  async (c) => {
    const portions = await db.select().from(portionsTable);
    return c.json(portions.map(toPortionResponse), 200);
  },
);

portionRoutes.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    tags: ["Portion"],
    request: {
      params: portionIdParamSchema,
    },
    responses: {
      200: {
        description: "Get portion by ID",
        content: {
          "application/json": {
            schema: portionResponseSchema,
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: validationErrorSchema,
          },
        },
      },
      404: {
        description: "Portion not found",
        content: {
          "application/json": {
            schema: notFoundErrorSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const [portion] = await db.select().from(portionsTable).where(eq(portionsTable.id, id));

    if (!portion) {
      return c.json(notFoundPortion, 404);
    }

    return c.json(toPortionResponse(portion), 200);
  },
);

portionRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    tags: ["Portion"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: createPortionBodySchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Created portion",
        content: {
          "application/json": {
            schema: portionResponseSchema,
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: validationErrorSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const payload = c.req.valid("json");
    const [portion] = await db.insert(portionsTable).values(payload).returning();

    if (!portion) {
      throw new Error("Failed to create portion");
    }

    return c.json(toPortionResponse(portion), 201);
  },
);

portionRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/{id}",
    tags: ["Portion"],
    request: {
      params: portionIdParamSchema,
      body: {
        content: {
          "application/json": {
            schema: updatePortionBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updated portion",
        content: {
          "application/json": {
            schema: portionResponseSchema,
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: validationErrorSchema,
          },
        },
      },
      404: {
        description: "Portion not found",
        content: {
          "application/json": {
            schema: notFoundErrorSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const payload = c.req.valid("json");
    const { id } = c.req.valid("param");

    const [portion] = await db
      .update(portionsTable)
      .set(payload)
      .where(eq(portionsTable.id, id))
      .returning();

    if (!portion) {
      return c.json(notFoundPortion, 404);
    }

    return c.json(toPortionResponse(portion), 200);
  },
);

portionRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/{id}",
    tags: ["Portion"],
    request: {
      params: portionIdParamSchema,
    },
    responses: {
      200: {
        description: "Deleted portion",
        content: {
          "application/json": {
            schema: deleteSuccessSchema,
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: validationErrorSchema,
          },
        },
      },
      404: {
        description: "Portion not found",
        content: {
          "application/json": {
            schema: notFoundErrorSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const deletedPortion = await db
      .delete(portionsTable)
      .where(eq(portionsTable.id, id))
      .returning();

    if (!deletedPortion.length) {
      return c.json(notFoundPortion, 404);
    }

    return c.json({ message: "Portion deleted successfully" as const }, 200);
  },
);
