export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string; avatar_url: string | null; phone: string | null; created_at: string; updated_at: string };
        Insert: { id: string; email: string; full_name?: string; avatar_url?: string | null; phone?: string | null };
        Update: { email?: string; full_name?: string; avatar_url?: string | null; phone?: string | null };
      };
      user_roles: {
        Row: { user_id: string; role: "admin" | "seller" | "buyer"; created_at: string };
        Insert: { user_id: string; role?: "admin" | "seller" | "buyer" };
        Update: { role?: "admin" | "seller" | "buyer" };
      };
      categories: {
        Row: { id: string; name: string; slug: string; icon: string | null; sort_order: number; is_active: boolean; created_at: string; updated_at: string };
        Insert: { name: string; slug: string; icon?: string | null; sort_order?: number; is_active?: boolean };
        Update: { name?: string; slug?: string; icon?: string | null; sort_order?: number; is_active?: boolean };
      };
      subcategories: {
        Row: { id: string; category_id: string; name: string; slug: string; sort_order: number; is_active: boolean; created_at: string; updated_at: string };
        Insert: { category_id: string; name: string; slug: string; sort_order?: number; is_active?: boolean };
        Update: { name?: string; slug?: string; sort_order?: number; is_active?: boolean };
      };
      businesses: {
        Row: { id: string; owner_id: string; name: string; slug: string; description: string | null; logo_url: string | null; category_id: string | null; address: string | null; city: string | null; commune: string | null; whatsapp: string; instagram: string | null; facebook: string | null; schedule: Json | null; latitude: number | null; longitude: number | null; is_active: boolean; created_at: string; updated_at: string };
        Insert: { owner_id: string; name: string; slug: string; description?: string | null; logo_url?: string | null; category_id?: string | null; address?: string | null; city?: string | null; commune?: string | null; whatsapp: string; instagram?: string | null; facebook?: string | null; schedule?: Json | null; latitude?: number | null; longitude?: number | null; is_active?: boolean };
        Update: { name?: string; slug?: string; description?: string | null; logo_url?: string | null; category_id?: string | null; address?: string | null; city?: string | null; commune?: string | null; whatsapp?: string; instagram?: string | null; facebook?: string | null; schedule?: Json | null; latitude?: number | null; longitude?: number | null; is_active?: boolean };
      };
      products: {
        Row: { id: string; business_id: string; name: string; slug: string; description: string | null; price: number; currency: string; category_id: string; subcategory_id: string | null; stock: number | null; is_unlimited_stock: boolean; is_available: boolean; is_featured: boolean; status: "published" | "draft"; sku: string | null; view_count: number; created_at: string; updated_at: string; deleted_at: string | null };
        Insert: { business_id: string; name: string; slug: string; description?: string | null; price: number; currency?: string; category_id: string; subcategory_id?: string | null; stock?: number | null; is_unlimited_stock?: boolean; is_available?: boolean; is_featured?: boolean; status?: "published" | "draft"; sku?: string | null };
        Update: { name?: string; slug?: string; description?: string | null; price?: number; currency?: string; category_id?: string; subcategory_id?: string | null; stock?: number | null; is_unlimited_stock?: boolean; is_available?: boolean; is_featured?: boolean; status?: "published" | "draft"; sku?: string | null };
      };
      product_images: {
        Row: { id: string; product_id: string; url: string; alt_text: string | null; sort_order: number; created_at: string };
        Insert: { product_id: string; url: string; alt_text?: string | null; sort_order?: number };
        Update: { url?: string; alt_text?: string | null; sort_order?: number };
      };
      favorites: {
        Row: { id: string; user_id: string; product_id: string; created_at: string };
        Insert: { user_id: string; product_id: string };
        Update: {};
      };
      product_views: {
        Row: { id: string; product_id: string; user_id: string | null; session_id: string | null; created_at: string };
        Insert: { product_id: string; user_id?: string | null; session_id?: string | null };
        Update: {};
      };
      whatsapp_clicks: {
        Row: { id: string; product_id: string; business_id: string; user_id: string | null; session_id: string | null; created_at: string };
        Insert: { product_id: string; business_id: string; user_id?: string | null; session_id?: string | null };
        Update: {};
      };
    };
  };
};
