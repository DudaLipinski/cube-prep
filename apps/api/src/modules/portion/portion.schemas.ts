import * as z from "zod";
import { PORTION_TYPES } from "../../shared/constants/portion-types";

export const uuidSchema = z.uuid();
export const portionIdParamSchema = z.object({
  id: uuidSchema,
});

export const portionTypeSchema = z.enum(PORTION_TYPES);
export const preparedAtSchema = z.iso.datetime().transform((value) => new Date(value));

export const createPortionBodySchema = z.object({
  name: z.string().trim().min(1),
  type: portionTypeSchema,
  quantity: z.number().int().positive(),
  prepared_at: preparedAtSchema,
});

export const updatePortionBodySchema = createPortionBodySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    error: "At least one field is required",
  });

export type CreatePortionBody = z.infer<typeof createPortionBodySchema>;
export type UpdatePortionBody = z.infer<typeof updatePortionBodySchema>;
