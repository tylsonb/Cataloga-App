# 02 — Arquitectura

## 1. Visión General

La plataforma sigue **Clean Architecture** adaptada al ecosistema Next.js + Supabase. El principio fundamental es la **separación de responsabilidades** en capas, donde cada capa depende solo de la capa inmediatamente inferior.

```
┌─────────────────────────────────────────────────┐
│                  PRESENTATION                    │
│  (React Components, Pages, UI - Shadcn/Tailwind) │
├─────────────────────────────────────────────────┤
│                   APPLICATION                    │
│  (Server Actions, Hooks, DTOs, Validators - Zod) │
├─────────────────────────────────────────────────┤
│                     DOMAIN                       │
│  (Entities, Business Rules, Types, Interfaces)   │
├─────────────────────────────────────────────────┤
│                  INFRASTRUCTURE                   │
│  (Supabase Client, Repositories, Storage, Auth)  │
└─────────────────────────────────────────────────┘
```

---

## 2. Capas Detalladas

### 2.1 Presentation (Presentación)

- **Páginas Next.js** (App Router): `app/` — routing, layouts, metadata SEO
- **Componentes UI**: `components/ui/` — componentes Shadcn reutilizables
- **Componentes de dominio**: `components/domain/` — componentes específicos de cada módulo
- **Hooks de vista**: `hooks/` — manejo de estado local, UI interactions

**Regla:** Esta capa **no accede directamente** a Supabase. Siempre pasa por la capa Application.

### 2.2 Application (Aplicación)

- **Server Actions**: operaciones del servidor (create, update, delete) validadas con Zod
- **Hooks de datos**: `hooks/` — wrappers de Server Actions para uso en cliente
- **DTOs (Data Transfer Objects)**: tipos intermedios entre dominio y presentación
- **Validadores**: esquemas Zod por módulo

**Regla:** Esta capa orquesta el dominio y la infraestructura. No contiene reglas de negocio.

### 2.3 Domain (Dominio)

- **Entidades**: tipos TypeScript que representan los modelos de negocio
- **Reglas de negocio**: validaciones de dominio, cálculos, transformaciones
- **Interfaces de repositorio**: contratos que la infraestructura debe implementar

**Regla:** El dominio **no depende** de ningún framework, librería externa ni Supabase. Es TypeScript puro.

### 2.4 Infrastructure (Infraestructura)

- **Cliente Supabase**: cliente server-side y browser-side
- **Repositorios**: implementaciones concretas de las interfaces del dominio
- **Storage**: gestión de archivos (imágenes de productos, logos)
- **Auth**: wrappers de Supabase Auth
- **Realtime**: suscripciones a cambios

**Regla:** Esta capa implementa las interfaces del dominio. Es la única que conoce Supabase.

---

## 3. Organización por Módulos

Cada módulo es autónomo y contiene sus propias 4 capas:

```
src/modules/
├── auth/           # Autenticación y gestión de usuarios
├── business/       # Perfil del negocio
├── product/        # Productos y gestión
├── search/         # Buscador y filtros
├── favorites/      # Favoritos
├── dashboard/      # Dashboard vendedor
├── admin/          # Panel administrador
├── analytics/      # Registro de eventos analíticos
└── shared/         # Componentes, hooks y utilidades compartidas
```

Dentro de cada módulo:

```
src/modules/product/
├── components/       # Componentes de presentación del módulo
├── actions/          # Server Actions (Application)
├── hooks/            # Hooks de datos y vista
├── schemas/          # Validadores Zod
├── types/            # Tipos del dominio (Entities, DTOs)
├── repositories/     # Interfaces e implementaciones (Infraestructura)
└── utils/            # Utilidades específicas del módulo
```

---

## 4. Flujo de Datos

### 4.1 Lectura (Read)

```
Page (Server Component)
  → Server Action / Repository
    → Supabase Client (server)
      → PostgreSQL (con RLS)
    → Mapeo a Entity/DTO
  → Render con datos
```

### 4.2 Escritura (Write)

```
Form (Client Component)
  → React Hook Form + Zod validation (client)
  → Server Action
    → Zod validation (server)
    → Repository
      → Supabase Client (server)
        → PostgreSQL (con RLS)
    → Revalidate path/tag
  → UI update
```

### 4.3 Tiempo Real (Realtime)

```
Supabase Realtime (Postgres Changes)
  → Supabase Client (browser)
    → Hook de suscripción
      → Estado local actualizado
        → UI refrescada
```

---

## 5. Autenticación y Autorización

### 5.1 Autenticación

- **Supabase Auth** gestiona sesiones con JWT
- Métodos: Email/Password, Google OAuth
- Middleware de Next.js para proteger rutas
- Cookies httpOnly para tokens ( SSR-compatible)

### 5.2 Autorización (RLS)

Cada tabla tiene políticas RLS que determinan qué filas puede leer/escribir cada usuario según su rol:

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| businesses | Pública (si active) | Owner | Owner | Owner |
| products | Pública (si published) | Owner del negocio | Owner | Owner |
| favorites | Owner | Owner | Owner | Owner |
| analytics_events | Pública INSERT | Cualquier auth | — | Admin |
| profiles | Self | Self | Self | — |
| categories | Pública | Admin | Admin | Admin |

Roles gestionados vía `user_roles` table + `auth.uid()`.

---

## 6. Gestión de Imágenes

```
Upload Flow:
  Client → Supabase Storage (bucket: product-images / business-logos)
    → URL pública generada
      → Guardada en tabla product_images / businesses.logo_url
```

- Compresión client-side antes de upload (canvas API)
- Múltiples tamaños generados vía Next.js Image Optimization
- URLs firmadas para imágenes privadas (si se requiere moderación)

---

## 7. PWA Architecture

### 7.1 Manifest

- `public/manifest.json` con iconos, theme color, display standalone
- Registrado en `<head>` via metadata

### 7.2 Service Worker

- Generado por `next-pwa` o `@serwist/next`
- Estrategias de cache:
  - **App Shell:** Cache First (HTML, CSS, JS)
  - **Imágenes:** Stale While Revalidate
  - **API/Data:** Network First con fallback a cache
- Offline: navegación entre páginas ya visitadas, mensaje offline para nuevas páginas

### 7.3 Instalación

- Cumple criterios de PWA installable:
  - HTTPS
  - Manifest con iconos 192px y 512px
  - Service Worker registrado
  - Start URL funcional offline

---

## 8. SEO Architecture

### 8.1 Renderizado

- **Server-Side Rendering (SSR)** para páginas de producto y negocio (contenido dinámico indexable)
- **Incremental Static Regeneration (ISR)** para landing, categorías y listados (revalidate: 3600s)
- **Static Generation** para páginas legales, about, etc.

### 8.2 Metadata

- `generateMetadata()` por ruta para meta tags dinámicos
- Open Graph + Twitter Cards
- Schema.org JSON-LD inyectado en páginas de producto y negocio
- `sitemap.xml` generado dinápicamente desde base de datos
- `robots.txt` con reglas de indexación

---

## 9. Tema Claro/Oscuro

- `next-themes` para gestión de tema
- CSS variables en Tailwind para ambos temas
- Persistencia en localStorage
- Detección de preferencia del sistema (`prefers-color-scheme`)
- Sin flash de tema incorrecto (script inline en `<head>`)

---

## 10. Escalabilidad

### 10.1 Horizontal

- Next.js en Vercel o self-hosted con auto-scaling
- Supabase escala verticalmente (CPU/RAM) y horizontalmente (read replicas en futuras fases)

### 10.2 Vertical (preparación)

- Módulos independientes permiten extraer microservicios en el futuro
- Edge Functions para lógica que requiera baja latencia
- Repositorios abstractos permiten cambiar Supabase por otra solución sin tocar dominio

### 10.3 Preparación para SaaS completo

- Multi-tenant ready: cada negocio es un "tenant" lógico
- Tabla `subscriptions` preparada (vacía en MVP) para futuros planes
- Edge Function hooks preparados para webhooks de pago

---

## 11. Diagrama de Componentes de Alto Nivel

```
                    ┌──────────┐
                    │  Browser  │
                    │  (PWA)    │
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │  Next.js   │
                    │  App Router │
                    │  (SSR/ISR)  │
                    └─────┬──────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
        ┌─────▼────┐ ┌───▼────┐ ┌───▼──────┐
        │  Server  │ │ Client │ │  Edge    │
        │ Actions  │ │Comps   │ │ Functions│
        └─────┬────┘ └───┬────┘ └─────┬────┘
              │           │            │
              └───────┬───┘            │
                      │                │
                ┌─────▼────┐    ┌──────▼─────┐
                │ Repositories │  │  Storage  │
                └─────┬────┘    └──────┬─────┘
                      │                │
                ┌─────▼────────────────▼────┐
                │       Supabase             │
                │  ┌─────────┬──────┬─────┐ │
                │  │PostgreSQL│ Auth │Realtime│ │
                │  └─────────┴──────┴─────┘ │
                └───────────────────────────┘
```

---

## 12. Decisiones Arquitectónicas Clave

| Decisión | Justificación |
|---|---|
| Server Actions sobre API Routes | Menos código, type-safe, integración nativa con Next.js 15 |
| App Router sobre Pages Router | Layouts anidados, streaming, server components |
| Zod en cliente y servidor | Validación doble, type inference con `z.infer` |
| Repositorios abstractos | Permite cambiar Supabase sin tocar dominio |
| RLS sobre middleware | Seguridad a nivel de base de datos, no bypassable |
| ISR en listados | Balance entre frescura y rendimiento |
| next-pwa/Serwist | Service Worker automatizado sin configuración manual compleja |
