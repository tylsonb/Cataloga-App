# 16 — Recomendaciones Técnicas

## 1. Configuración del Proyecto

### 1.1 Next.js 15

- Usar **App Router** exclusivamente (no Pages Router)
- Aprovechar **Server Components** por defecto; usar `"use client"` solo cuando sea necesario (estado, eventos, hooks del navegador)
- **Server Actions** para todas las operaciones de escritura
- **Streaming** con `<Suspense>` para cargar datos progresivamente
- Configurar `output: 'standalone'` si se despliega fuera de Vercel

### 1.2 TypeScript

- `strict: true` en `tsconfig.json`
- `noUncheckedIndexedAccess: true` para acceso seguro a arrays
- Usar `satisfies` en lugar de `as` cuando sea posible
- Generar tipos de Supabase con `supabase gen types typescript`
- No usar `any` — usar `unknown` si el tipo es desconocido

### 1.3 TailwindCSS

- Usar **CSS variables** para colores (compatibilidad con tema claro/oscuro)
- Configurar `darkMode: 'class'` (manejado por `next-themes`)
- Mobile-first: escribir estilos base para mobile, añadir breakpoints para tablet/desktop
- Usar `container` con `max-width` responsivo
- Aprovechar `@layer` para organizar estilos custom

### 1.4 Shadcn UI

- Instalar solo los componentes necesarios (tree-shaking)
- Customizar `components.json` con el alias correcto
- Sobrescribir estilos vía CSS variables, no editando componentes directamente
- Usar `cn()` utility para combinar clases condicionalmente

---

## 2. Supabase

### 2.1 Clientes

```typescript
// Server (Server Components, Server Actions, Route Handlers)
import { createClient } from '@/lib/supabase/server'

// Browser (Client Components, hooks)
import { createClient } from '@/lib/supabase/client'

// Middleware (auth refresh)
import { createClient } from '@/lib/supabase/middleware'
```

- **Nunca** usar el cliente browser en Server Components
- **Nunca** usar el cliente server en Client Components
- El cliente middleware se usa solo en `middleware.ts` para refresh de tokens

### 2.2 RLS

- **Siempre** habilitar RLS en cada tabla, incluso si la política es permisiva
- Usar funciones `SECURITY DEFINER` para helper functions (`is_admin()`, etc.)
- Marcar funciones helper como `STABLE` para permitir optimización
- Probar políticas con diferentes usuarios antes de deployar
- **Nunca** deshabilitar RLS para "facilitar" desarrollo

### 2.3 Migraciones

- Usar Supabase CLI para generar y aplicar migraciones
- Una migración por cambio de esquema
- Versionar migraciones en `supabase/migrations/`
- Nunca editar una migración ya aplicada — crear una nueva
- Usar `seed.sql` solo para datos iniciales (categorías, ciudades)

### 2.4 Storage

- Buckets públicos para imágenes de productos, logos y avatares
- Nombrar archivos con UUID para evitar colisiones: `{user_id}/{uuid}.{ext}`
- Implementar compresión client-side antes de upload
- Eliminar imágenes huérfanas al eliminar productos (vía trigger o Server Action)
- Considerar URLs firmadas para contenido privado en el futuro

---

## 3. Formularios

### 3.1 React Hook Form + Zod

```typescript
// Patrón recomendado:
const schema = z.object({ ... })
type FormData = z.infer<typeof schema>

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})
```

- Definir el schema Zod **una vez** y reutilizar en cliente y servidor
- Usar `z.infer` para tipar el formulario (DRY)
- Mostrar errores en tiempo real con `form.formState.errors`
- Deshabilitar botón submit mientras se envía
- Mostrar estado de carga en el botón
- Limpiar formulario tras éxito (si aplica)

### 3.2 Validación doble

```typescript
// Server Action
export async function createProductAction(input: unknown) {
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }
  // ... proceed with parsed.data
}
```

- **Siempre** validar en el servidor, incluso si ya se validó en el cliente
- Usar `safeParse` (no `parse`) para evitar excepciones
- Retornar errores estructurados al cliente

---

## 4. PWA

### 4.1 Service Worker

- Usar `@serwist/next` (sucesor de `next-pwa`, compatible con Next.js 15)
- Estrategias de cache:
  - **App Shell (HTML/JS/CSS):** Cache First + actualización en background
  - **Imágenes:** Stale While Revalidate (muestra cache, actualiza en background)
  - **Páginas de producto:** Network First con fallback a cache (contenido dinámico)
  - **API/Server Actions:** Network Only (no cachear mutations)
- Página offline custom con mensaje y botón de retry
- Actualización automática del Service Worker (skipWaiting + clientsClaim)

### 4.2 Manifest

```json
{
  "name": "Catáloga",
  "short_name": "Catáloga",
  "description": "Catálogo inteligente para productos de WhatsApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0f172a",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 4.3 iOS

- iOS no soporta prompt de instalación automático
- Mostrar instrucciones: "Comparte → Añadir a pantalla de inicio"
- Usar `apple-touch-icon` link en `<head>`
- Usar `apple-mobile-web-app-capable` meta tag

---

## 5. SEO

### 5.1 Metadata por página

```typescript
// app/producto/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  return {
    title: `${product.name} | Catáloga`,
    description: product.description,
    openGraph: {
      images: [product.primaryImage],
    },
  }
}
```

### 5.2 Schema.org

- `Product` schema en páginas de producto
- `LocalBusiness` schema en páginas de negocio
- `BreadcrumbList` en navegación
- `WebSite` schema en home
- Inyectar como JSON-LD en `<script type="application/ld+json">`

### 5.3 Sitemap dinámico

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductSlugs()
  const businesses = await getAllBusinessSlugs()
  const categories = await getAllCategorySlugs()

  return [
    { url: 'https://cataloga.cl', priority: 1 },
    ...products.map(p => ({ url: `https://cataloga.cl/producto/${p.slug}`, priority: 0.8 })),
    ...businesses.map(b => ({ url: `https://cataloga.cl/negocio/${b.slug}`, priority: 0.7 })),
    ...categories.map(c => ({ url: `https://cataloga.cl/categoria/${c.slug}`, priority: 0.6 })),
  ]
}
```

---

## 6. Rendimiento

### 6.1 Core Web Vitals

| Métrica | Objetivo | Estrategia |
|---|---|---|
| LCP | < 2.5s | ISR en landing, next/image, preload de imágenes críticas |
| CLS | < 0.1 | Dimensiones de imagen definidas, skeleton loaders |
| INP | < 200ms | Debounce en búsqueda, optimistic updates, code splitting |

### 6.2 Optimizaciones

- **Code splitting:** `dynamic()` imports para componentes pesados (gráficos, mapas)
- **Lazy loading:** imágenes con `loading="lazy"`, componentes con `next/dynamic`
- **Prefetch:** Next.js prefetch automático de links visibles
- **ISR:** `revalidate = 3600` en páginas de listado (categorías, búsqueda)
- **Cache headers:** `Cache-Control` en assets estáticos
- **Bundle analyzer:** `@next/bundle-analyzer` para monitorear tamaño de bundle

### 6.3 Imágenes

- Usar `next/image` siempre (no `<img>`)
- Configurar dominios remotos en `next.config.ts`
- Usar `sizes` attribute para responsive images
- Usar `placeholder="blur"` cuando sea posible
- Compresión WebP/AVIF automática por Next.js

---

## 7. Seguridad

### 7.1 Auth

- Cookies `httpOnly` + `secure` (gestionadas por Supabase)
- Refresh token automático en middleware
- Redirect a `/login` si sesión expira
- No almacenar tokens en localStorage

### 7.2 Validación

- Zod en **todas** las Server Actions
- Sanitizar HTML en descripciones (si se permite rich text en el futuro)
- Limitar tamaño de uploads (máx 5MB por imagen)
- Limitar número de imágenes por producto (máx 5)

### 7.3 Rate Limiting

- Implementar en middleware o Edge Function
- Limitar: registro (5/hora por IP), login (10/minuto por IP), búsqueda (60/minuto por IP)
- Usar `Upstash Redis` para rate limiting distribuido si se necesita

### 7.4 Headers de Seguridad

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

---

## 8. Testing

### 8.1 Estrategia

| Tipo | Herramienta | Cobertura |
|---|---|---|
| Unit | Vitest | Schemas, utils, funciones puras |
| Integration | Vitest + Supabase local | Server Actions, repositorios |
| E2E | Playwright | Flujos críticos: registro, crear producto, búsqueda, favoritos |
| Visual | Storybook (opcional) | Componentes UI |

### 8.2 Tests críticos a escribir

1. **Auth:** registro, login, logout, reset password
2. **Product CRUD:** crear, editar, eliminar, validar RLS
3. **Search:** búsqueda con filtros, ordenamiento, paginación
4. **Favorites:** agregar, eliminar, listar
5. **Analytics:** registro de eventos
6. **RLS:** verificar que un vendedor no puede editar productos de otro

---

## 9. Despliegue

### 9.1 Entornos

| Entorno | Plataforma | Propósito |
|---|---|---|
| Development | Local + Supabase local (Docker) | Desarrollo diario |
| Preview | Vercel Preview + Supabase branch | PRs, testing |
| Production | Vercel + Supabase Production | Live |

### 9.2 CI/CD

- GitHub Actions para:
  - Lint (ESLint + Prettier)
  - Type check (`tsc --noEmit`)
  - Tests unit e integration
  - Build check
- Vercel auto-deploy en merge a `main`
- Supabase migrations via CLI en deploy

### 9.3 Variables de Entorno

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # Solo server, nunca exponer
NEXT_PUBLIC_SITE_URL=https://cataloga.cl
```

---

## 10. Monitoreo

| Herramienta | Propósito |
|---|---|
| Vercel Analytics | Core Web Vitals, tráfico |
| Supabase Dashboard | Queries, auth, storage, RLS |
| Google Search Console | Indexación, SEO, queries de búsqueda |
| Sentry (opcional) | Error tracking en producción |

---

## 11. Convenciones de Código

### 11.1 Naming

- **Archivos:** `kebab-case.ts` para módulos, `PascalCase.tsx` para componentes
- **Funciones:** `camelCase` (ej: `createProductAction`)
- **Tipos/Interfaces:** `PascalCase` (ej: `ProductDTO`)
- **Constantes:** `UPPER_SNAKE_CASE` (ej: `MAX_PRODUCT_IMAGES`)
- **Componentes:** `PascalCase` (ej: `ProductCard`)

### 11.2 Estructura de Server Actions

```typescript
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const schema = z.object({ ... })

export async function createProductAction(input: unknown) {
  // 1. Validar input
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.message }
  }

  // 2. Verificar auth
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  // 3. Verificar autorización (RLS también protege, pero doble check)
  // 4. Ejecutar operación
  // 5. Revalidar cache
  revalidatePath('/dashboard/productos')
  // 6. Retornar resultado
  return { success: true, data: { id: '...' } }
}
```

### 11.3 Git

- **Branch naming:** `feat/xxx`, `fix/xxx`, `chore/xxx`, `docs/xxx`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **PRs:** Requeridos para merge a `main`
- **Reviews:** Al menos 1 approval (si hay equipo)

---

## 12. Dependencias Recomendadas

### Producción

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "@supabase/supabase-js": "^2.45.0",
  "@supabase/ssr": "^0.5.0",
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "zod": "^3.23.0",
  "next-themes": "^0.3.0",
  "@serwist/next": "^1.0.0",
  "lucide-react": "^0.400.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.5.0",
  "recharts": "^2.12.0"
}
```

### Desarrollo

```json
{
  "typescript": "^5.6.0",
  "tailwindcss": "^3.4.0",
  "eslint": "^9.0.0",
  "prettier": "^3.3.0",
  "vitest": "^2.0.0",
  "@playwright/test": "^1.47.0",
  "@types/node": "^22.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0"
}
```

### Notas

- `recharts` para gráficos del dashboard (ligero y React-native)
- `lucide-react` para iconos (tree-shakeable, compatible con Shadcn)
- `@serwist/next` es el sucesor moderno de `next-pwa` para Service Workers en Next.js 15
- `@supabase/ssr` reemplaza al antiguo `@supabase/auth-helpers-nextjs` con mejor soporte SSR
