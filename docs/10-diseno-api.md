# 10 — Diseño de API

## 1. Enfoque Arquitectónico

El MVP utiliza **Server Actions** de Next.js 15 como capa de API principal, evitando la necesidad de API Routes REST tradicionales. Esto proporciona:

- **Type safety** end-to-end (cliente y servidor comparten tipos)
- **Menos código** boilerplate
- **Integración nativa** con React Server Components
- **Validación** con Zod en ambos lados

Solo se utilizan **API Routes** para casos específicos como generación de Open Graph images.

---

## 2. Server Actions por Módulo

### 2.1 Módulo: Auth

#### `loginAction`

```typescript
// Input
{
  email: string
  password: string
}

// Output (success)
{
  success: true
  user: { id: string, email: string, fullName: string }
}

// Output (error)
{
  success: false
  error: string  // "Credenciales inválidas"
}
```

#### `registerAction`

```typescript
// Input
{
  email: string
  password: string
  fullName: string
}

// Output
{
  success: boolean
  error?: string  // "Email ya registrado", "Contraseña débil"
}
```

#### `resetPasswordAction`

```typescript
// Input
{ email: string }

// Output
{ success: boolean, error?: string }
```

#### `updatePasswordAction`

```typescript
// Input
{ password: string }

// Output
{ success: boolean, error?: string }
```

#### `updateProfileAction`

```typescript
// Input
{
  fullName?: string
  avatarUrl?: string
  phone?: string
}

// Output
{ success: boolean, error?: string }
```

#### `logoutAction`

```typescript
// Input: ninguno
// Output: { success: boolean }
```

---

### 2.2 Módulo: Business

#### `createBusinessAction`

```typescript
// Input
{
  name: string
  description?: string
  logoFile?: File      // Se sube a Storage
  categoryId: string
  address?: string
  city?: string
  commune?: string
  whatsapp: string
  instagram?: string
  facebook?: string
  schedule?: ScheduleObject
  latitude?: number
  longitude?: number
}

// Output
{
  success: boolean
  data?: { id: string, slug: string }
  error?: string
}
```

#### `updateBusinessAction`

```typescript
// Input
{
  id: string
  name?: string
  description?: string
  logoFile?: File
  categoryId?: string
  address?: string
  city?: string
  commune?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  schedule?: ScheduleObject
  latitude?: number
  longitude?: number
}

// Output
{ success: boolean, error?: string }
```

#### `toggleBusinessStatusAction`

```typescript
// Input
{ id: string, isActive: boolean }

// Output
{ success: boolean, error?: string }
```

#### `getBusinessBySlugAction`

```typescript
// Input
{ slug: string }

// Output
{
  success: boolean
  data?: BusinessDTO
  error?: string
}
```

#### `getBusinessByOwnerAction`

```typescript
// Input: ninguno (usa auth.uid())

// Output
{
  success: boolean
  data?: BusinessDTO
  error?: string
}
```

---

### 2.3 Módulo: Product

#### `createProductAction`

```typescript
// Input
{
  businessId: string
  name: string
  description?: string
  price: number
  currency: string      // 'CLP' | 'USD' | etc.
  categoryId: string
  subcategoryId?: string
  stock?: number
  isUnlimitedStock: boolean
  isAvailable: boolean
  isFeatured: boolean
  status: 'published' | 'draft'
  sku?: string
  images: File[]        // Máx 5, se suben a Storage
}

// Output
{
  success: boolean
  data?: { id: string, slug: string }
  error?: string
}
```

#### `updateProductAction`

```typescript
// Input (todos opcionales excepto id)
{
  id: string
  name?: string
  description?: string
  price?: number
  currency?: string
  categoryId?: string
  subcategoryId?: string
  stock?: number
  isUnlimitedStock?: boolean
  isAvailable?: boolean
  isFeatured?: boolean
  status?: 'published' | 'draft'
  sku?: string
  newImages?: File[]
  existingImageIds?: string[]   // Para mantener/reordenar
  deletedImageIds?: string[]
}

// Output
{ success: boolean, error?: string }
```

#### `deleteProductAction`

```typescript
// Input
{ id: string }

// Output
{ success: boolean, error?: string }
```

#### `toggleProductFeaturedAction`

```typescript
// Input
{ id: string, isFeatured: boolean }

// Output
{ success: boolean, error?: string }
```

#### `getProductBySlugAction`

```typescript
// Input
{ slug: string }

// Output
{
  success: boolean
  data?: ProductDetailDTO
  error?: string
}
```

#### `getProductsAction`

```typescript
// Input
{
  page?: number          // default: 1
  pageSize?: number      // default: 24
  search?: string
  categoryId?: string
  subcategoryId?: string
  city?: string
  commune?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'recent' | 'most_viewed' | 'price_asc' | 'price_desc'
  businessId?: string
  featuredOnly?: boolean
}

// Output
{
  success: boolean
  data?: {
    products: ProductCardDTO[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
  }
  error?: string
}
```

#### `getRelatedProductsAction`

```typescript
// Input
{ productId: string, limit?: number }  // default limit: 6

// Output
{
  success: boolean
  data?: ProductCardDTO[]
  error?: string
}
```

#### `getProductsByBusinessAction`

```typescript
// Input
{
  businessId: string
  page?: number
  pageSize?: number
  status?: 'published' | 'draft' | 'all'
}

// Output
{
  success: boolean
  data?: {
    products: ProductManageDTO[]
    total: number
    page: number
    hasMore: boolean
  }
  error?: string
}
```

---

### 2.4 Módulo: Search

#### `searchProductsAction`

```typescript
// Input (igual que getProductsAction pero optimizado para búsqueda)
{
  query?: string
  categoryId?: string
  subcategoryId?: string
  city?: string
  commune?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'recent' | 'most_viewed' | 'price_asc' | 'price_desc'
  page?: number
  pageSize?: number
}

// Output
{
  success: boolean
  data?: {
    products: ProductCardDTO[]
    total: number
    page: number
    hasMore: boolean
    facets: {
      categories: { id: string, name: string, count: number }[]
      cities: { name: string, count: number }[]
    }
  }
  error?: string
}
```

---

### 2.5 Módulo: Favorites

#### `toggleFavoriteAction`

```typescript
// Input
{ productId: string }

// Output
{
  success: boolean
  isFavorite: boolean
  error?: string
}
```

#### `getFavoritesAction`

```typescript
// Input
{ page?: number, pageSize?: number }

// Output
{
  success: boolean
  data?: {
    products: ProductCardDTO[]
    total: number
    page: number
    hasMore: boolean
  }
  error?: string
}
```

#### `checkFavoriteStatusAction`

```typescript
// Input
{ productIds: string[] }

// Output
{
  success: boolean
  data?: Record<string, boolean>  // { productId: isFavorite }
  error?: string
}
```

---

### 2.6 Módulo: Dashboard (Vendedor)

#### `getDashboardStatsAction`

```typescript
// Input
{ businessId: string, dateRange?: { from: Date, to: Date } }

// Output
{
  success: boolean
  data?: {
    totalViews: number
    totalProducts: number
    publishedProducts: number
    draftProducts: number
    totalWhatsappClicks: number
    totalFavorites: number
    viewsTimeline: { date: string, count: number }[]
    whatsappClicksTimeline: { date: string, count: number }[]
    topProducts: {
      id: string
      name: string
      slug: string
      views: number
      whatsappClicks: number
      favorites: number
    }[]
  }
  error?: string
}
```

---

### 2.7 Módulo: Admin

#### `getAdminStatsAction`

```typescript
// Input: ninguno

// Output
{
  success: boolean
  data?: {
    totalUsers: number
    totalBusinesses: number
    totalProducts: number
    totalViews: number
    totalWhatsappClicks: number
    newUsersThisMonth: number
    newBusinessesThisMonth: number
  }
  error?: string
}
```

#### `getUsersAction`

```typescript
// Input
{
  page?: number
  pageSize?: number
  search?: string
  role?: 'admin' | 'seller' | 'buyer'
  status?: 'active' | 'suspended'
}

// Output
{
  success: boolean
  data?: {
    users: AdminUserDTO[]
    total: number
    page: number
    hasMore: boolean
  }
  error?: string
}
```

#### `toggleUserStatusAction`

```typescript
// Input
{ userId: string, isSuspended: boolean }

// Output
{ success: boolean, error?: string }
```

#### `getBusinessesAdminAction`

```typescript
// Input
{
  page?: number
  pageSize?: number
  search?: string
  isActive?: boolean
}

// Output
{
  success: boolean
  data?: {
    businesses: AdminBusinessDTO[]
    total: number
    page: number
    hasMore: boolean
  }
  error?: string
}
```

#### `toggleBusinessStatusAdminAction`

```typescript
// Input
{ businessId: string, isActive: boolean }

// Output
{ success: boolean, error?: string }
```

#### `createCategoryAction`

```typescript
// Input
{ name: string, icon?: string, sortOrder?: number }

// Output
{
  success: boolean
  data?: { id: string, slug: string }
  error?: string
}
```

#### `updateCategoryAction`

```typescript
// Input
{
  id: string
  name?: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
}

// Output
{ success: boolean, error?: string }
```

#### `deleteCategoryAction`

```typescript
// Input
{ id: string }

// Output
{ success: boolean, error?: string }
```

#### `createSubcategoryAction`

```typescript
// Input
{ categoryId: string, name: string, sortOrder?: number }

// Output
{
  success: boolean
  data?: { id: string, slug: string }
  error?: string
}
```

#### `getReportedProductsAction`

```typescript
// Input
{ page?: number, pageSize?: number, status?: 'pending' | 'approved' | 'rejected' }

// Output
{
  success: boolean
  data?: {
    reports: ReportedProductDTO[]
    total: number
    page: number
    hasMore: boolean
  }
  error?: string
}
```

#### `resolveReportAction`

```typescript
// Input
{ reportId: string, status: 'approved' | 'rejected' }

// Output
{ success: boolean, error?: string }
```

#### `exportDataAction`

```typescript
// Input
{
  type: 'users' | 'businesses' | 'products' | 'analytics'
  format: 'csv'
  dateRange?: { from: Date, to: Date }
}

// Output
{
  success: boolean
  data?: { downloadUrl: string }  // URL temporal del CSV
  error?: string
}
```

---

### 2.8 Módulo: Analytics

#### `trackProductViewAction`

```typescript
// Input
{ productId: string }

// Output: { success: boolean }
// Nota: fire-and-forget, no bloquea la UI
```

#### `trackWhatsappClickAction`

```typescript
// Input
{ productId: string, businessId: string }

// Output: { success: boolean }
```

#### `trackBusinessViewAction`

```typescript
// Input
{ businessId: string }

// Output: { success: boolean }
```

#### `trackSearchAction`

```typescript
// Input
{
  query?: string
  filters: Record<string, unknown>
  resultsCount: number
}

// Output: { success: boolean }
```

---

## 3. DTOs (Data Transfer Objects)

### ProductCardDTO

```typescript
interface ProductCardDTO {
  id: string
  slug: string
  name: string
  price: number
  currency: string
  primaryImage: string | null
  businessName: string
  businessSlug: string
  city: string | null
  isAvailable: boolean
  isFeatured: boolean
  viewCount: number
}
```

### ProductDetailDTO

```typescript
interface ProductDetailDTO {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  currency: string
  stock: number | null
  isUnlimitedStock: boolean
  isAvailable: boolean
  isFeatured: boolean
  sku: string | null
  images: {
    id: string
    url: string
    altText: string | null
    sortOrder: number
  }[]
  category: { id: string, name: string, slug: string }
  subcategory: { id: string, name: string, slug: string } | null
  business: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    city: string | null
    commune: string | null
    whatsapp: string
    instagram: string | null
    facebook: string | null
  }
  viewCount: number
  createdAt: string
}
```

### BusinessDTO

```typescript
interface BusinessDTO {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  category: { id: string, name: string, slug: string } | null
  address: string | null
  city: string | null
  commune: string | null
  whatsapp: string
  instagram: string | null
  facebook: string | null
  schedule: ScheduleObject | null
  latitude: number | null
  longitude: number | null
  isActive: boolean
  productCount: number
  createdAt: string
}
```

### ScheduleObject

```typescript
interface ScheduleObject {
  monday?: { open: string; close: string } | null
  tuesday?: { open: string; close: string } | null
  wednesday?: { open: string; close: string } | null
  thursday?: { open: string; close: string } | null
  friday?: { open: string; close: string } | null
  saturday?: { open: string; close: string } | null
  sunday?: { open: string; close: string } | null
}
```

---

## 4. API Routes (Mínimas)

### `GET /api/og/[slug]` — Open Graph Image

Genera dinámicamente una imagen OG para cada producto usando `next/og`.

```
Request: GET /api/og/producto-zapatos-deportivos-abc123
Response: image/png (1200x630)
```

### `GET /api/manifest.json` — PWA Manifest (opcional dinámico)

Si se requiere manifest dinámico, se sirve desde aquí. Por defecto, se usa `public/manifest.json` estático.

---

## 5. Convenciones

| Convención | Descripción |
|---|---|
| **Nomenclatura** | `camelCase` para funciones, `PascalCase` para tipos/interfaces |
| **Sufijos** | `.action.ts` (Server Actions), `.schema.ts` (Zod), `.hook.ts` (React hooks), `.repository.ts` (repositorios), `.types.ts` (tipos) |
| **Errores** | Siempre retornar `{ success: false, error: string }` nunca lanzar excepciones al cliente |
| **Validación** | Toda acción valida input con Zod antes de ejecutar lógica |
| **Revalidación** | Toda acción de escritura llama `revalidatePath()` o `revalidateTag()` |
| **Auth check** | Toda acción protegida verifica `auth.uid()` antes de proceder |
| **Rate limiting** | Implementar en Edge Functions o middleware para acciones sensibles |
