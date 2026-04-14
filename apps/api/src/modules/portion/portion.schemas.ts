import { z } from "@hono/zod-openapi";
import { PORTION_TYPES } from "@/shared/constants/portion-types";
export { notFoundErrorSchema, validationErrorSchema } from "@/shared/schemas/error-schemas";

export const portionTypeSchema = z.enum(PORTION_TYPES);
export const dateSchema = z.iso.datetime().transform((value) => new Date(value));
export const dateToIsoSchema = z.date().transform((d) => d.toISOString());

export const portionIdParamSchema = z.object({
  id: z.uuid().openapi({
    param: {
      name: "id",
      in: "path",
    },
    example: "00000000-0000-0000-0000-000000000001",
  }),
});

const SORTABLE_COLUMNS = ["name", "quantity", "prepared_at", "created_at"] as const;

export const listPortionsQuerySchema = z.object({
  type: portionTypeSchema.optional().openapi({ example: "protein" }),
  sort: z.enum(SORTABLE_COLUMNS).optional().openapi({ example: "created_at" }),
  order: z.enum(["asc", "desc"]).optional().openapi({ example: "desc" }),
});

export type ListPortionsQuery = z.infer<typeof listPortionsQuerySchema>;

export const createPortionBodySchema = z
  .object({
    name: z.string().trim().min(1).openapi({ example: "Rice cubes" }),
    type: portionTypeSchema,
    quantity: z.number().positive().openapi({ example: 4 }),
    prepared_at: dateSchema,
  })
  .openapi("CreatePortionBody");

export const updatePortionBodySchema = z
  .object({
    name: z.string().trim().min(1).optional().openapi({ example: "Rice cubes" }),
    type: portionTypeSchema.optional(),
    quantity: z.number().optional().openapi({ example: 4 }),
    prepared_at: dateSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    error: "At least one field is required",
  })
  .openapi("UpdatePortionBody");

export const portionResponseSchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    type: portionTypeSchema,
    quantity: z.number(),
    prepared_at: dateToIsoSchema,
    created_at: dateToIsoSchema,
  })
  .openapi("Portion");

export const deleteSuccessSchema = z
  .object({
    message: z.literal("Portion deleted successfully"),
  })
  .openapi("DeletePortionSuccess");

export type CreatePortionBody = z.infer<typeof createPortionBodySchema>;
export type UpdatePortionBody = z.infer<typeof updatePortionBodySchema>;
