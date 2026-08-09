import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().min(2, "El nombre del negocio es obligatorio"),
  description: z.string().optional(),
  whatsapp: z.string().min(8, "Ingresa un número de WhatsApp válido"),
  category_id: z.string().uuid().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  commune: z.string().optional(),
  instagram: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  logo_url: z.string().url().optional().or(z.literal("")),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
