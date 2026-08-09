import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().optional(),
  category_id: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  city: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: z.enum(["relevance", "price_asc", "price_desc", "newest"]).default("newest"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(48).default(24),
});

export type SearchInput = z.infer<typeof searchSchema>;
