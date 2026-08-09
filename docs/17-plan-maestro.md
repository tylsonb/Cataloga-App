# Catáloga — Plan Maestro de Ejecución (Mega Plan)

> Generado a partir de `docs/01-16`, `src/`, `supabase/migrations/` y `package.json`.  
> Objetivo: llevar el proyecto desde el estado actual hasta el MVP funcional en 12 semanas.

---

## 1. Estado actual (línea base)

### 1.1 Implementado

- **Proyecto base:** Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, PostCSS.
- **Supabase SSR:** `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`.
- **Middleware:** actualiza sesión y protege rutas de `/favoritos`, `/perfil`, `/dashboard`, `/negocio/crear` y `/admin`.
- **Tema:** `next-themes`, `ThemeProvider`, `ThemeToggle`, variables CSS en `globals.css`.
- **Auth (parcial):** `login-form.tsx`, `register-form.tsx`, `reset-password-form.tsx`, `auth.actions.ts`, `auth.schema.ts`.
- **Páginas existentes:** `/`, `/buscar`, `/login`, `/registro`, `/recuperar-password`, `not-found.tsx`.
- **SEO inicial:** `sitemap.ts`, `robots.ts`, `layout.tsx` con metadata y `manifest.json`.
- **Layout básico:** `Header`, `Footer`.
- **Constantes:** `src/lib/constants.ts` (SITE_URL, monedas, límites de imágenes, etc.).
- **Base de datos (parcial):** migraciones `0001-0005` con tablas principales, RLS básico, triggers de perfil/updated_at/promoción a seller/views, buckets de Storage y seed de categorías.

### 1.2 Brechas críticas identificadas

- **OAuth incompleto:** no existe `src/app/auth/callback/route.ts` ni flujo PKCE/confirmación de email.
- **Reset de contraseña incompleto:** falta página `/actualizar-password` y `updatePasswordAction`.
- **Auth sin perfil ni logout UI:** faltan `updateProfileAction`, `GoogleButton`, `AuthProvider`, `useAuth`, menú de usuario y cierre de sesión.
- **Sin grupos de rutas:** `(protected)`, `(seller)`, `(admin)` y sus layouts.
- **Sin módulos de negocio:** `business`, `product`, `search`, `favorites`, `dashboard`, `admin`, `analytics`.
- **Sin páginas públicas clave:** `/producto/[slug]`, `/negocio/[slug]`, `/categoria/[slug]`, `/terminos`, `/privacidad`.
- **Componentes shadcn mínimos:** solo `button` e `input`. Faltan `dialog`, `select`, `card`, `badge`, `avatar`, `checkbox`, `switch`, `tabs`, `toast`, `tooltip`, `skeleton`, `separator`, `label`, `form`, `dropdown-menu`, `sheet`.
- **Sin PWA real:** `manifest.json` sin iconos; no hay service worker.
- **Sin OG images dinámicas:** no existe `src/app/api/og/[slug]/route.tsx`.
- **Sin tests:** no hay carpeta `tests/` ni scripts de test.
- **DB doc vs migraciones desfasadas:** faltan tablas, triggers, políticas e índices (ver sección 5).

---

## 2. Alcance del MVP

- **Métricas de éxito:** ≥50 vendedores, <3 clics para encontrar producto, ≥30% CTR WhatsApp, ≥60% vendedores con 5+ productos.
- **Historias:** 26 Must Have, 16 Should Have, 4 Could Have.
- **Sprints:** 6 sprints de 2 semanas (~150 SP totales).
- **Stack:** Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, Supabase (PostgreSQL, Auth, Storage, Realtime), PWA.

---

## 3. Roadmap de ejecución

### Fase 0 — Cierre de fundaciones (3 días)

**Objetivo:** base de datos final, autenticación 100% funcional, tipos y layouts base.

- [ ] **DB:** finalizar `docs/08-modelo-base-de-datos.md` y sincronizar con `supabase/migrations/` (ver checklist sección 5).
- [ ] **Tipos:** generar `src/types/database.types.ts` con `supabase gen types typescript --local > src/types/database.types.ts`.
- [ ] **OAuth:** crear `src/app/auth/callback/route.ts` que intercambie el código y redirija a `/`.
- [ ] **Reset:** crear `src/app/(auth)/actualizar-password/page.tsx` y `updatePasswordAction`.
- [ ] **Perfil:** crear `updateProfileAction`, `src/app/(protected)/perfil/page.tsx`, `ProfileForm` y `AuthProvider`.
- [ ] **Google:** agregar `GoogleButton` en login/registro y probar flujo completo.
- [ ] **Logout:** agregar menú de usuario en `Header` y acción de logout.
- [ ] **Layouts:** crear `(protected)/layout.tsx`, `(seller)/layout.tsx`, `(admin)/layout.tsx`.
- [ ] **UI base:** instalar componentes shadcn restantes (`select`, `card`, `badge`, `avatar`, `checkbox`, `switch`, `tabs`, `toast`, `tooltip`, `skeleton`, `separator`, `label`, `form`, `dialog`, `dropdown-menu`, `sheet`).
- [ ] **Middleware:** mejorar redirección post-login con `?redirect=` y logout con refresh.

**Entregables:** auth completo, layouts protegidos, tipos Supabase listos, DB consistente.

### Fase 1 — Negocio y Productos (semanas 3-4)

**Objetivo:** vendedor puede crear su negocio y gestionar productos.

- [ ] **Módulo `business`:**
  - `src/modules/business/types/business.types.ts`
  - `src/modules/business/schemas/business.schema.ts`
  - `src/modules/business/repositories/business.repository.ts`
  - `src/modules/business/actions/*.action.ts` (`create`, `update`, `toggleStatus`, `getBySlug`, `getByOwner`)
  - `src/modules/business/components/BusinessForm.tsx`, `BusinessCard.tsx`, `BusinessInfo.tsx`
  - `src/app/(protected)/negocio/crear/page.tsx`
  - `src/app/(seller)/dashboard/negocio/page.tsx` y `editar/page.tsx`
  - Subida de logo a bucket `business-logos`.
- [ ] **Módulo `product`:**
  - `src/modules/product/types/product.types.ts`
  - `src/modules/product/schemas/product.schema.ts`
  - `src/modules/product/repositories/product.repository.ts`
  - `src/modules/product/actions/*.action.ts` (`create`, `update`, `delete`, `toggleFeatured`, `getBySlug`, `getProducts`, `getByBusiness`, `getRelated`)
  - `src/modules/product/components/ProductForm.tsx`, `ProductCard.tsx`, `ProductGrid.tsx`, `ProductGallery.tsx`, `ImageUploader.tsx`, `ProductListTable.tsx`
  - `src/app/(seller)/dashboard/productos/page.tsx`, `nuevo/page.tsx`, `[id]/editar/page.tsx`
  - Subida de imágenes a bucket `product-images` (máx. 5, compresión client-side).
- [ ] **Módulo `shared`:**
  - `src/modules/shared/utils/slug.util.ts`, `whatsapp.util.ts`, `format.util.ts`
  - `src/modules/shared/components/PriceDisplay.tsx`, `CategoryBadge.tsx`, `EmptyState.tsx`, `LoadingSkeleton.tsx`, `Breadcrumb.tsx`, `ShareButton.tsx`, `WhatsAppButton.tsx`

### Fase 2 — Búsqueda y Catálogo Público (semanas 5-6)

**Objetivo:** compradores pueden buscar y ver productos.

- [ ] **Página pública de búsqueda:**
  - Reemplazar placeholder de `src/app/(public)/buscar/page.tsx`.
  - Implementar `searchProductsAction` con filtros, ordenamiento y paginación.
  - Componentes: `SearchBar`, `SearchFilters`, `SearchResults`, `SortDropdown`.
  - Integrar índice GIN `products_search_idx`.
- [ ] **Página de producto:**
  - `src/app/(public)/producto/[slug]/page.tsx` con SSR y `generateMetadata`.
  - Galería, info del negocio, productos relacionados, WhatsApp, favorito, compartir.
  - `trackProductViewAction` y `trackWhatsappClickAction`.
- [ ] **Página de negocio:**
  - `src/app/(public)/negocio/[slug]/page.tsx` con catálogo del vendedor.
  - `trackBusinessViewAction`.
- [ ] **Página de categoría:**
  - `src/app/(public)/categoria/[slug]/page.tsx`.
- [ ] **Responsive:** mobile-first, grids adaptativos, bottom nav opcional en mobile.
- [ ] **SEO básico:** meta tags dinámicos, sitemap con productos/negocios, `robots.ts` actualizado.

### Fase 3 — Favoritos, Dashboard y Admin (semanas 7-8)

**Objetivo:** funcionalidades de comprador y panel administrador.

- [ ] **Favoritos:**
  - `src/modules/favorites/types/favorites.types.ts`
  - `src/modules/favorites/repositories/favorites.repository.ts`
  - `src/modules/favorites/actions/*.action.ts` (`toggle`, `get`, `checkStatus`)
  - `src/modules/favorites/components/FavoriteButton.tsx`, `FavoritesList.tsx`
  - `src/app/(protected)/favoritos/page.tsx`
- [ ] **Dashboard vendedor:**
  - `src/modules/dashboard/actions/getDashboardStats.action.ts`
  - `src/modules/dashboard/components/StatsCard.tsx`, `ViewsChart.tsx`, `TopProducts.tsx`
  - `src/app/(seller)/dashboard/page.tsx`
- [ ] **Panel admin:**
  - `src/modules/admin/actions/*.action.ts` (`getStats`, `getUsers`, `getBusinesses`, `toggleUserStatus`, `toggleBusinessStatus`, `manageCategory`, `exportData`)
  - `src/modules/admin/components/AdminSidebar.tsx`, `AdminStats.tsx`, `UsersTable.tsx`, `BusinessesTable.tsx`, `CategoriesManager.tsx`
  - `src/app/(admin)/admin/page.tsx`, `usuarios/page.tsx`, `negocios/page.tsx`, `categorias/page.tsx`
- [ ] **PWA instalable:** service worker, iconos, splash, manifest completo.

### Fase 4 — Refinamiento Should Have (semanas 9-10)

**Objetivo:** features de segunda prioridad.

- [ ] Perfil de usuario (`/perfil`) edición completa y avatar.
- [ ] Pausar/activar negocio (`toggleBusinessStatus`).
- [ ] Página pública de negocio mejorada.
- [ ] Producto destacado con límite de 5 por negocio.
- [ ] Stock y disponibilidad refinados.
- [ ] Filtros por ciudad/comuna (`cities` + texto libre) y rango de precio.
- [ ] Paginación infinita (`useInfiniteScroll`).
- [ ] Compartir producto (Web Share API + copiar link).
- [ ] Tema oscuro refinado (sin flash).

### Fase 5 — Pulido, SEO avanzado, Testing y Lanzamiento (semanas 11-12)

**Objetivo:** calidad, performance y lanzamiento.

- [ ] Productos relacionados en detalle.
- [ ] Productos más vistos y favoritos recibidos en dashboard.
- [ ] Gestión de usuarios y negocios en admin.
- [ ] Navegación offline básica (service worker + cache de páginas visitadas).
- [ ] Schema.org JSON-LD (`Product`, `LocalBusiness`, `BreadcrumbList`).
- [ ] Open Graph images dinámicas: `src/app/api/og/[slug]/route.tsx`.
- [ ] Tests unitarios e integración (auth, product, search).
- [ ] Bug fixing, lint, type-check, Lighthouse/Core Web Vitals.
- [ ] Deploy en Vercel + Supabase producción.

---

## 4. Plan detallado por módulo

### 4.1 Autenticación (`src/modules/auth/`)

| Archivo | Estado | Acción |
|---|---|---|
| `actions/auth.actions.ts` | Existe | Agregar `updateProfileAction`, `updatePasswordAction`, manejar confirmación de email, mejorar errores. |
| `schemas/auth.schema.ts` | Existe | Agregar `updateProfileSchema`, `updatePasswordSchema`. |
| `components/login-form.tsx` | Existe | Integrar `GoogleButton`, mostrar/ocultar contraseña. |
| `components/register-form.tsx` | Existe | Integrar `GoogleButton`, link a términos. |
| `components/reset-password-form.tsx` | Existe | Mejorar UX con toast. |
| `components/google-button.tsx` | No existe | Crear. |
| `components/profile-form.tsx` | No existe | Crear. |
| `hooks/use-auth.hook.ts` | No existe | Crear hook de sesión con `supabase.auth.onAuthStateChange`. |
| `repositories/auth.repository.ts` | No existe | Crear wrapper limpio de Supabase Auth. |
| `app/auth/callback/route.ts` | No existe | Crear intercambio de código OAuth. |
| `app/(auth)/actualizar-password/page.tsx` | No existe | Crear. |
| `app/(protected)/perfil/page.tsx` | No existe | Crear. |

### 4.2 Negocio (`src/modules/business/`)

Crear estructura completa: `types`, `schemas`, `repositories`, `actions`, `components`, `hooks`.

- Server Actions: `createBusinessAction`, `updateBusinessAction`, `toggleBusinessStatusAction`, `getBusinessBySlugAction`, `getBusinessByOwnerAction`.
- Componentes: `BusinessForm`, `BusinessCard`, `BusinessInfo`, `BusinessList`.
- Páginas: `(protected)/negocio/crear`, `(seller)/dashboard/negocio`, `(seller)/dashboard/negocio/editar`, `(public)/negocio/[slug]`.
- Validación: WhatsApp, Instagram/Facebook URLs, horario JSON.
- Slug automático (trigger + fallback en schema).

### 4.3 Productos (`src/modules/product/`)

Crear estructura completa.

- Server Actions: `createProductAction`, `updateProductAction`, `deleteProductAction`, `toggleProductFeaturedAction`, `getProductBySlugAction`, `getProductsAction`, `getProductsByBusinessAction`, `getRelatedProductsAction`.
- Componentes: `ProductForm`, `ProductCard`, `ProductGrid`, `ProductGallery`, `ImageUploader`, `ProductListTable`, `ProductDetail`, `ProductRelated`.
- Páginas: `(public)/producto/[slug]`, `(seller)/dashboard/productos`, `nuevo`, `[id]/editar`.
- Imágenes: subida múltiple, preview, reordenar, eliminar, compresión, máx. 5.

### 4.4 Buscador (`src/modules/search/`)

- `search.schema.ts`, `search.types.ts`.
- `search-products.action.ts` con filtros combinables y paginación.
- `use-search.hook.ts`, `SearchBar`, `SearchFilters`, `SearchResults`, `SortDropdown`.
- Integrar `search_logs` para registrar queries y `results_count`.

### 4.5 Favoritos (`src/modules/favorites/`)

- `favorites.types.ts`, `favorites.repository.ts`.
- `toggleFavorite.action.ts`, `getFavorites.action.ts`, `checkFavoriteStatus.action.ts`.
- `FavoriteButton` (optimistic update), `FavoritesList`.
- Página `(protected)/favoritos`.

### 4.6 Dashboard vendedor (`src/modules/dashboard/`)

- `getDashboardStats.action.ts` (vistas, clicks WhatsApp, productos, top 5, timeline 30 días).
- `use-dashboard-stats.hook.ts`.
- Componentes: `StatsCard`, `ViewsChart`, `WhatsappClicksChart`, `TopProducts`.
- Usar `recharts` (ya en dependencias).

### 4.7 Admin (`src/modules/admin/`)

- `getAdminStatsAction`, `getUsersAction`, `getBusinessesAdminAction`, `toggleUserStatusAction`, `toggleBusinessStatusAdminAction`.
- `createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction`, `createSubcategoryAction`.
- `getReportedProductsAction`, `resolveReportAction`, `exportDataAction`.
- Componentes: `AdminSidebar`, `AdminStats`, `UsersTable`, `BusinessesTable`, `ProductsTable`, `CategoriesManager`, `ModerationQueue`.

### 4.8 Analytics (`src/modules/analytics/`)

- `trackProductView.action.ts`, `trackWhatsappClick.action.ts`, `trackBusinessView.action.ts`, `trackSearch.action.ts`.
- `use-analytics.hook.ts`, `session.util.ts`.
- Insertar eventos en `product_views`, `whatsapp_clicks`, `business_views`, `search_logs`.

### 4.9 Shared / UI

- Instalar componentes shadcn faltantes vía CLI.
- Crear `src/modules/shared/utils/` con `format.util.ts`, `slug.util.ts`, `whatsapp.util.ts`, `cn.util.ts` (ya existe `src/lib/utils.ts`).
- Crear `src/modules/shared/components/` con `CategoryBadge`, `PriceDisplay`, `EmptyState`, `LoadingSkeleton`, `Pagination`, `ShareButton`, `WhatsAppButton`, `ImageOptimized`, `Breadcrumb`.
- `src/components/layout/mobile-nav.tsx`, `sidebar.tsx`.

---

## 5. Base de datos, RLS, triggers y Storage

### 5.1 Tablas faltantes en migraciones vs `docs/08-modelo-base-de-datos.md`

Agregar en `supabase/migrations/` (por ejemplo `0006_fixes_and_missing_tables.sql`):

- `business_views` (eventos de visita a negocio).
- `search_logs` (registro de búsquedas).
- `reported_products` (moderación post-MVP, Could Have).
- `cities` (Should Have, para autocompletar ciudad/comuna).

### 5.2 Triggers faltantes

- `generate_business_slug()` y trigger `before_business_insert`.
- `generate_product_slug()` y trigger `before_product_insert`.
- `set_seller_role()` al crear `businesses` (ya existe `promote_business_owner` en `0003`; normalizar nombres).
- `increment_product_view_count()` al insertar `product_views` (ya existe en `0003`; normalizar nombres).

### 5.3 RLS y políticas faltantes

- Política `DELETE` para `businesses` (owner).
- Política `DELETE` para `products` (owner/admin).
- RLS para `business_views`, `search_logs`, `reported_products`.
- Revisar `categories_select` (actualmente `is_active OR is_admin()`; docs dice `true`). Decidir si se ocultan categorías inactivas del público.
- `profiles_insert_self` (si se inserta desde cliente) o dejar solo trigger.
- `user_roles` insert/update admin.
- Revisar Storage policies: product-images/business-logos deben verificar ownership del objeto (path con `owner_id` o bucket + `auth.uid()`). Las actuales con `auth.role()` son demasiado permisivas.

### 5.4 Índices faltantes / optimización

- `idx_profiles_email`.
- `idx_favorites_product`.
- `idx_businesses_name` para búsqueda (o índice GIN).
- Revisar `idx_products_search` ya existe en `0001`.
- Considerar índice en `products(price)` y `products(created_at desc)` si no están.

### 5.5 Tipos de Supabase

- Ejecutar `npx supabase gen types typescript --local > src/types/database.types.ts` (o `--project-id` si remoto).
- Actualizar `tsconfig.json` si es necesario; actualmente `@/*` apunta a `./src/*`, por lo que `src/types/database.types.ts` se importa como `@/types/database.types`.

---

## 6. PWA, SEO y experiencia

### 6.1 PWA

- Crear iconos en `public/icons/` (192, 512, maskable).
- Completar `public/manifest.json` con iconos, screenshots, orientation.
- Configurar service worker. Opciones:
  - `@serwist/next` (recomendado para Next 15).
  - `next-pwa` (legacy, puede dar problemas con App Router).
- Agregar `beforeinstallprompt` y botón "Instalar app".
- Navegación offline básica (cache de app shell + fallback).

### 6.2 SEO

- `generateMetadata` en todas las páginas dinámicas.
- Open Graph + Twitter Cards.
- `sitemap.ts` que consulte productos y negocios publicados.
- Schema.org JSON-LD en `producto/[slug]` y `negocio/[slug]`.
- `api/og/[slug]/route.tsx` para OG images.
- `robots.ts` correcto (ya existe, revisar disallow de `/actualizar-password`).

### 6.3 UI/UX

- Mobile-first, bottom nav en mobile, sidebar en desktop para seller/admin.
- Toasts para acciones (éxito/error).
- Estados vacíos y skeleton loaders.
- Lazy loading de imágenes con `next/image`.
- Accesibilidad: ARIA, contraste, navegación por teclado.

---

## 7. Testing y calidad

- Agregar script `test` en `package.json` (Vitest o Jest).
- Tests unitarios para schemas Zod y utilidades.
- Tests de integración para Server Actions críticas (auth, product, search).
- E2E para flujo crítico: login → crear negocio → crear producto → buscar.
- `type-check` y `lint` en CI (ya existen scripts).
- Lighthouse: LCP < 2.5s, CLS < 0.1.

---

## 8. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Baja adopción de vendedores | Onboarding simple, importar desde WhatsApp futuro. |
| Subida de imágenes lenta | Compresión client-side, bucket público, `next/image` optimization. |
| RLS complejo | Probar cada política con usuario real y admin. |
| SEO difícil con App Router | Usar Server Components + `generateMetadata` + `sitemap.ts` + OG route. |
| PWA en Next 15 | Usar `@serwist/next` y probar en Chrome/Edge/Safari. |

---

## 9. Definición de Done global

Para considerar una historia lista:

1. Código TypeScript con tipado completo.
2. Validación Zod en cliente y servidor.
3. RLS aplicado y probado.
4. Responsive (mobile, tablet, desktop).
5. Funciona en tema claro y oscuro.
6. SEO/meta tags si aplica.
7. Lazy loading si aplica.
8. Sin errores en consola.
9. JSDoc en funciones complejas.
10. Tests básicos de integración.

---

## 10. Próximos pasos inmediatos (hoy)

1. **Terminar `docs/08-modelo-base-de-datos.md`** desde la línea 183 hasta el final.
2. **Crear `supabase/migrations/0006_fixes_and_missing_tables.sql`** con tablas, triggers, RLS e índices faltantes.
3. **Aplicar migraciones** y generar `src/types/database.types.ts`.
4. **Crear `src/app/auth/callback/route.ts`** para cerrar el flujo OAuth.
5. **Crear `src/app/(auth)/actualizar-password/page.tsx`** y `updatePasswordAction`.
6. **Añadir `GoogleButton`** y probar registro/login con Google.
7. **Crear layouts protegidos** `(protected)`, `(seller)`, `(admin)`.
8. **Instalar componentes shadcn faltantes** (`dialog`, `select`, `card`, etc.).

Una vez cerrada la Fase 0, comenzar la Fase 1 con `business` y `product`.
