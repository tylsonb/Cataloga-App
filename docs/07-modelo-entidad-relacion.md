# 07 — Modelo Entidad-Relación

## 1. Diagrama ER

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│   profiles   │       │ user_roles   │       │    businesses    │
├──────────────┤       ├──────────────┤       ├──────────────────┤
│ id (PK)      │──1:1──│ user_id (PK) │       │ id (PK)          │
│ email        │       │ role         │──1:N──│ owner_id (FK)    │
│ full_name    │       └──────────────┘       │ name             │
│ avatar_url   │                               │ slug             │
│ phone        │                               │ description      │
│ created_at   │                               │ logo_url         │
│ updated_at   │                               │ category_id (FK) │
└──────────────┘                               │ address          │
                                               │ city             │
                                               │ commune          │
                                               │ whatsapp         │
                                               │ instagram        │
                                               │ facebook         │
                                               │ schedule         │
                                               │ latitude         │
                                               │ longitude        │
                                               │ is_active        │
                                               │ created_at       │
                                               │ updated_at       │
                                               └────────┬─────────┘
                                                        │
                                                        │ 1:N
                                                        ▼
┌──────────────┐       ┌──────────────────┐     ┌──────────────────┐
│  categories  │──1:N──│ subcategories    │     │    products      │
├──────────────┤       ├──────────────────┤     ├──────────────────┤
│ id (PK)      │       │ id (PK)          │     │ id (PK)          │
│ name         │       │ category_id (FK) │     │ business_id (FK) │
│ slug         │       │ name             │     │ name             │
│ icon         │       │ slug             │     │ slug             │
│ sort_order   │       │ sort_order       │     │ description      │
│ created_at   │       │ created_at       │     │ price            │
└──────────────┘       └──────────────────┘     │ currency         │
                                                │ category_id (FK) │
                                                │ subcategory_id(FK)│
                                                │ stock            │
                                                │ is_available     │
                                                │ is_featured      │
                                                │ status           │
                                                │ sku              │
                                                │ view_count       │
                                                │ created_at       │
                                                │ updated_at       │
                                                │ deleted_at       │
                                                └────────┬─────────┘
                                                         │
                                    ┌────────────────────┤
                                    │ 1:N                │ 1:N
                                    ▼                    ▼
                        ┌──────────────────┐   ┌──────────────────┐
                        │ product_images   │   │   favorites      │
                        ├──────────────────┤   ├──────────────────┤
                        │ id (PK)          │   │ id (PK)          │
                        │ product_id (FK)  │   │ user_id (FK)     │
                        │ url              │   │ product_id (FK)  │
                        │ alt_text         │   │ created_at       │
                        │ sort_order       │   └──────────────────┘
                        │ created_at       │
                        └──────────────────┘

┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│   product_views      │   │  whatsapp_clicks     │   │  business_views      │
├──────────────────────┤   ├──────────────────────┤   ├──────────────────────┤
│ id (PK)              │   │ id (PK)              │   │ id (PK)              │
│ product_id (FK)      │   │ product_id (FK)      │   │ business_id (FK)     │
│ user_id (FK, null)   │   │ business_id (FK)     │   │ user_id (FK, null)   │
│ session_id           │   │ user_id (FK, null)   │   │ session_id           │
│ created_at           │   │ session_id           │   │ created_at           │
└──────────────────────┘   │ created_at           │   └──────────────────────┘
                           └──────────────────────┘

┌──────────────────────┐   ┌──────────────────────┐
│   search_logs        │   │  reported_products   │
├──────────────────────┤   ├──────────────────────┤
│ id (PK)              │   │ id (PK)              │
│ query                │   │ product_id (FK)      │
│ filters (JSONB)      │   │ reported_by (FK)     │
│ results_count        │   │ reason               │
│ user_id (FK, null)   │   │ status               │
│ session_id           │   │ created_at           │
│ created_at           │   │ resolved_at          │
└──────────────────────┘   └──────────────────────┘
```

## 2. Entidades y Relaciones

### 2.1 profiles ↔ user_roles (1:1)
- Un usuario tiene un rol principal
- Roles: `admin`, `seller`, `buyer`
- Un `seller` es un `buyer` que además tiene un negocio

### 2.2 businesses ↔ profiles (N:1)
- Un negocio pertenece a un usuario (owner)
- Un usuario puede tener un solo negocio en el MVP

### 2.3 businesses ↔ categories (N:1)
- Un negocio tiene una categoría principal

### 2.4 categories ↔ subcategories (1:N)
- Una categoría tiene múltiples subcategorías
- Una subcategoría pertenece a una categoría

### 2.5 products ↔ businesses (N:1)
- Un producto pertenece a un negocio
- Un negocio tiene muchos productos

### 2.6 products ↔ categories (N:1)
- Un producto tiene una categoría

### 2.7 products ↔ subcategories (N:1)
- Un producto tiene una subcategoría (opcional)

### 2.8 products ↔ product_images (1:N)
- Un producto tiene múltiples imágenes (máx 5)
- Ordenadas por `sort_order`

### 2.9 products ↔ favorites (1:N)
- Un producto puede ser favorito de muchos usuarios
- Un usuario puede tener muchos favoritos
- Relación N:M a través de tabla `favorites`

### 2.10 products ↔ product_views (1:N)
- Cada visita a un producto se registra
- `user_id` nullable (visitantes no autenticados)

### 2.11 products ↔ whatsapp_clicks (1:N)
- Cada click en WhatsApp se registra
- Vinculado también al negocio

### 2.12 businesses ↔ business_views (1:N)
- Cada visita a la página de un negocio se registra

### 2.13 search_logs (independiente)
- Registro de búsquedas realizadas
- Para analíticas de búsqueda

### 2.14 products ↔ reported_products (1:N)
- Productos pueden ser reportados
- Admin revisa y resuelve

## 3. Cardinalidades Resumidas

| Relación | Cardinalidad | Descripción |
|---|---|---|
| profiles → user_roles | 1:1 | Un usuario, un rol |
| profiles → businesses | 1:N | Un usuario puede tener un negocio (MVP: 1) |
| categories → subcategories | 1:N | Una categoría, muchas subcategorías |
| categories → businesses | 1:N | Una categoría, muchos negocios |
| categories → products | 1:N | Una categoría, muchos productos |
| subcategories → products | 1:N | Una subcategoría, muchos productos |
| businesses → products | 1:N | Un negocio, muchos productos |
| products → product_images | 1:N | Un producto, muchas imágenes (máx 5) |
| users → favorites → products | N:M | Usuarios guardan productos favoritos |
| products → product_views | 1:N | Un producto, muchas vistas |
| products → whatsapp_clicks | 1:N | Un producto, muchos clicks |
| businesses → business_views | 1:N | Un negocio, muchas vistas |
| products → reported_products | 1:N | Un producto, muchos reportes |
