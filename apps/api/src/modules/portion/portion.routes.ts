import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { validationError } from "@/shared/validation-errors";
import {
  createPortionBodySchema,
  deleteSuccessSchema,
  listPortionsQuerySchema,
  notFoundErrorSchema,
  portionResponseSchema,
  portionIdParamSchema,
  updatePortionBodySchema,
  validationErrorSchema,
} from "./portion.schemas";
import {
  listPortions,
  getPortionById,
  createPortion,
  updatePortion,
  deletePortion,
} from "./portion.model";

const notFoundPortion = {
  error: "not_found" as const,
  message: "Portion not found",
  status: 404 as const,
};

export const portionRoutes = new OpenAPIHono({
  defaultHook: validationError("Validation failed"),
});

portionRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    tags: ["Portion"],
    request: {
      query: listPortionsQuerySchema,
    },
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
    const query = c.req.valid("query");
    const portions = await listPortions(query);
    return c.json(portions, 200);
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
    const portion = await getPortionById(id);

    if (!portion) {
      return c.json(notFoundPortion, 404);
    }

    return c.json(portion, 200);
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
    const portion = await createPortion(payload);

    return c.json(portion, 201);
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

    const portion = await updatePortion(id, payload);

    if (!portion) {
      return c.json(notFoundPortion, 404);
    }

    return c.json(portion, 200);
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

    const deletedPortions = await deletePortion(id);
    if (!deletedPortions.length) {
      return c.json(notFoundPortion, 404);
    }

    return c.json({ message: "Portion deleted successfully" as const }, 200);
  },
);
