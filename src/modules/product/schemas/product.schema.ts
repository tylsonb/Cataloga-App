import { z } from "zod";

export const createProductSchema = z.object({
  business_id: z.string().uuid(),
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional(),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  currency: z.string().default("CLP"),
  category_id: z.string().uuid(),
  subcategory_id: z.string().uuid().optional(),
  stock: z.number().int().min(0).optional(),
  is_unlimited_stock: z.boolean().default(false),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("published"),
  sku: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
