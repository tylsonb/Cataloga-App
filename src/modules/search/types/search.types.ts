export type SearchFilters = {
  q?: string;
  category_id?: string;
  business_id?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest";
  page?: number;
  pageSize?: number;
};

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  image_url?: string;
  business_name?: string;
};
