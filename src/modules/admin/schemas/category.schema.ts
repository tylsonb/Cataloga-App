import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  slug: z.string().min(2, "El slug es obligatorio"),
  icon: z.string().optional(),
  sort_order: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
