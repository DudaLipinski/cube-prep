import { z } from "@hono/zod-openapi";

export const notFoundErrorSchema = z
  .object({
    error: z.literal("not_found"),
    message: z.string(),
    status: z.literal(404),
  })
  .openapi("NotFoundError");

export const validationErrorSchema = z
  .object({
    error: z.literal("validation_error"),
    message: z.string(),
    issues: z.array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    ),
  })
  .openapi("ValidationError");
