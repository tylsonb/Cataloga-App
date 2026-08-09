export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
import type { Database } from "@/types/database.types";
