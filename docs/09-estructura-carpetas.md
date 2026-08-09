# 09 — Estructura de Carpetas

## Estructura Completa del Proyecto

```
cataloga/
├── .env                          # Variables de entorno (no commitear)
├── .env.example                  # Template de variables de entorno
├── .env.local                    # Variables locales (no commitear)
├── .gitignore
├── next.config.ts                # Configuración Next.js 15
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json               # Configuración Shadcn UI
├── middleware.ts                 # Middleware de auth y rutas protegidas
├── README.md
│
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service Worker (generado)
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── icon-maskable-192.png
│   │   ├── icon-maskable-512.png
│   │   └── favicon.ico
│   ├── robots.txt
│   └── images/
│       ├── logo.svg
│       ├── logo-dark.svg
│       └── placeholder-product.svg
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   ├── 0003_triggers.sql
│   │   ├── 0004_storage_buckets.sql
│   │   └── 0005_seed_data.sql
│   ├── functions/
│   │   └── (vacío en MVP - solo si se necesita Edge Functions)
│   └── seed.sql
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Grupo de rutas públicas
│   │   │   ├── layout.tsx        # Layout público (header, footer)
│   │   │   ├── page.tsx          # Home / Landing
│   │   │   ├── buscar/
│   │   │   │   └── page.tsx      # Resultados de búsqueda
│   │   │   ├── producto/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Detalle de producto
│   │   │   ├── negocio/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Página pública del negocio
│   │   │   ├── categoria/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Productos por categoría
│   │   │   ├── terminos/
│   │   │   │   └── page.tsx
│   │   │   └── privacidad/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/               # Grupo de rutas de autenticación
│   │   │   ├── layout.tsx        # Layout auth (centrado, sin nav)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── registro/
│   │   │   │   └── page.tsx
│   │   │   └── recuperar-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (protected)/          # Grupo de rutas autenticadas
│   │   │   ├── layout.tsx        # Layout con auth check
│   │   │   ├── favoritos/
│   │   │   │   └── page.tsx
│   │   │   ├── perfil/
│   │   │   │   └── page.tsx
│   │   │   └── negocio/
│   │   │       └── crear/
│   │   │           └── page.tsx  # Onboarding vendedor
│   │   │
│   │   ├── (seller)/             # Grupo de rutas del vendedor
│   │   │   ├── layout.tsx        # Layout con sidebar vendedor
│   │   │   └── dashboard/
│   │   │       ├── page.tsx              # Dashboard vendedor
│   │   │       ├── productos/
│   │   │       │   ├── page.tsx          # Lista de productos
│   │   │       │   ├── nuevo/
│   │   │       │   │   └── page.tsx      # Crear producto
│   │   │       │   └── [id]/
│   │   │       │       └── editar/
│   │   │       │           └── page.tsx  # Editar producto
│   │   │       ├── negocio/
│   │   │       │   ├── page.tsx          # Ver/editar negocio
│   │   │       │   └── editar/
│   │   │       │       └── page.tsx
│   │   │       └── configuracion/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (admin)/              # Grupo de rutas admin
│   │   │   ├── layout.tsx        # Layout con sidebar admin
│   │   │   └── admin/
│   │   │       ├── page.tsx              # Dashboard admin
│   │   │       ├── usuarios/
│   │   │       │   └── page.tsx
│   │   │       ├── negocios/
│   │   │       │   └── page.tsx
│   │   │       ├── productos/
│   │   │       │   └── page.tsx
│   │   │       ├── categorias/
│   │   │       │   └── page.tsx
│   │   │       ├── moderacion/
│   │   │       │   └── page.tsx
│   │   │       └── reportes/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                  # API Routes (mínimas, solo si necesario)
│   │   │   └── og/
│   │   │       └── [slug]/
│   │   │           └── route.tsx # Generación dinámica de OG images
│   │   │
│   │   ├── sitemap.ts            # Sitemap dinámico
│   │   ├── robots.ts             # Robots.txt dinámico
│   │   ├── layout.tsx            # Root layout (html, body, providers)
│   │   ├── error.tsx             # Error boundary global
│   │   ├── not-found.tsx         # Página 404
│   │   └── loading.tsx           # Loading UI global
│   │
│   ├── modules/                  # Módulos de dominio (Clean Architecture)
│   │   ├── auth/
│   │   │   ├── actions/
│   │   │   │   ├── login.action.ts
│   │   │   │   ├── register.action.ts
│   │   │   │   ├── reset-password.action.ts
│   │   │   │   ├── logout.action.ts
│   │   │   │   └── update-profile.action.ts
│   │   │   ├── schemas/
│   │   │   │   ├── login.schema.ts
│   │   │   │   ├── register.schema.ts
│   │   │   │   └── profile.schema.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.hook.ts
│   │   │   │   └── use-user.hook.ts
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   ├── reset-password-form.tsx
│   │   │   │   ├── google-button.tsx
│   │   │   │   └── profile-form.tsx
│   │   │   ├── repositories/
│   │   │   │   ├── auth.repository.ts
│   │   │   │   └── profile.repository.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── business/
│   │   │   ├── actions/
│   │   │   │   ├── create-business.action.ts
│   │   │   │   ├── update-business.action.ts
│   │   │   │   ├── toggle-business-status.action.ts
│   │   │   │   └── get-business.action.ts
│   │   │   ├── schemas/
│   │   │   │   └── business.schema.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-business.hook.ts
│   │   │   │   └── use-business-products.hook.ts
│   │   │   ├── components/
│   │   │   │   ├── business-form.tsx
│   │   │   │   ├── business-card.tsx
│   │   │   │   ├── business-info.tsx
│   │   │   │   └── business-list.tsx
│   │   │   ├── repositories/
│   │   │   │   └── business.repository.ts
│   │   │   └── types/
│   │   │       └── business.types.ts
│   │   │
│   │   ├── product/
│   │   │   ├── actions/
│   │   │   │   ├── create-product.action.ts
│   │   │   │   ├── update-product.action.ts
│   │   │   │   ├── delete-product.action.ts
│   │   │   │   ├── toggle-featured.action.ts
│   │   │   │   ├── get-product.action.ts
│   │   │   │   └── get-products.action.ts
│   │   │   ├── schemas/
│   │   │   │   └── product.schema.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-products.hook.ts
│   │   │   │   └── use-product-detail.hook.ts
│   │   │   ├── components/
│   │   │   │   ├── product-form.tsx
│   │   │   │   ├── product-card.tsx
│   │   │   │   ├── product-grid.tsx
│   │   │   │   ├── product-gallery.tsx
│   │   │   │   ├── product-detail.tsx
│   │   │   │   ├── product-related.tsx
│   │   │   │   ├── image-uploader.tsx
│   │   │   │   └── product-list-table.tsx
│   │   │   ├── repositories/
│   │   │   │   └── product.repository.ts
│   │   │   └── types/
│   │   │       └── product.types.ts
│   │   │
│   │   ├── search/
│   │   │   ├── actions/
│   │   │   │   └── search-products.action.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-search.hook.ts
│   │   │   ├── components/
│   │   │   │   ├── search-bar.tsx
│   │   │   │   ├── search-filters.tsx
│   │   │   │   ├── search-results.tsx
│   │   │   │   └── sort-dropdown.tsx
│   │   │   ├── schemas/
│   │   │   │   └── search.schema.ts
│   │   │   └── types/
│   │   │       └── search.types.ts
│   │   │
│   │   ├── favorites/
│   │   │   ├── actions/
│   │   │   │   ├── toggle-favorite.action.ts
│   │   │   │   └── get-favorites.action.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-favorites.hook.ts
│   │   │   │   └── use-favorite-status.hook.ts
│   │   │   ├── components/
│   │   │   │   ├── favorite-button.tsx
│   │   │   │   └── favorites-list.tsx
│   │   │   ├── repositories/
│   │   │   │   └── favorites.repository.ts
│   │   │   └── types/
│   │   │       └── favorites.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── actions/
│   │   │   │   └── get-dashboard-stats.action.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-dashboard-stats.hook.ts
│   │   │   ├── components/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   ├── views-chart.tsx
│   │   │   │   ├── whatsapp-clicks-chart.tsx
│   │   │   │   └── top-products.tsx
│   │   │   └── types/
│   │   │       └── dashboard.types.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── actions/
│   │   │   │   ├── get-admin-stats.action.ts
│   │   │   │   ├── manage-user.action.ts
│   │   │   │   ├── manage-business.action.ts
│   │   │   │   ├── manage-category.action.ts
│   │   │   │   └── export-data.action.ts
│   │   │   ├── components/
│   │   │   │   ├── admin-sidebar.tsx
│   │   │   │   ├── admin-stats.tsx
│   │   │   │   ├── users-table.tsx
│   │   │   │   ├── businesses-table.tsx
│   │   │   │   ├── products-table.tsx
│   │   │   │   ├── categories-manager.tsx
│   │   │   │   └── moderation-queue.tsx
│   │   │   ├── schemas/
│   │   │   │   └── category.schema.ts
│   │   │   └── types/
│   │   │       └── admin.types.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── actions/
│   │   │   │   ├── track-product-view.action.ts
│   │   │   │   ├── track-whatsapp-click.action.ts
│   │   │   │   ├── track-business-view.action.ts
│   │   │   │   └── track-search.action.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-analytics.hook.ts
│   │   │   └── utils/
│   │   │       └── session.util.ts
│   │   │
│   │   └── shared/               # Módulo compartido
│   │       ├── components/
│   │       │   ├── category-badge.tsx
│   │       │   ├── price-display.tsx
│   │       │   ├── empty-state.tsx
│   │       │   ├── loading-skeleton.tsx
│   │       │   ├── pagination.tsx
│   │       │   ├── share-button.tsx
│   │       │   ├── whatsapp-button.tsx
│   │       │   ├── image-optimized.tsx
│   │       │   └── breadcrumb.tsx
│   │       ├── hooks/
│   │       │   ├── use-debounce.hook.ts
│   │       │   ├── use-infinite-scroll.hook.ts
│   │       │   └── use-theme.hook.ts
│   │       └── utils/
│   │           ├── format.util.ts
│   │           ├── slug.util.ts
│   │           ├── whatsapp.util.ts
│   │           └── cn.util.ts
│   │
│   ├── components/               # Componentes UI globales (Shadcn)
│   │   ├── ui/                   # Componentes Shadcn generados
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── label.tsx
│   │   │   └── form.tsx
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── theme-toggle.tsx
│   │   └── providers/
│   │       ├── theme-provider.tsx
│   │       ├── auth-provider.tsx
│   │       └── toast-provider.tsx
│   │
│   ├── lib/                     # Infraestructura y configuración
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase browser client
│   │   │   ├── server.ts         # Supabase server client
│   │   │   └── middleware.ts     # Supabase middleware client
│   │   ├── utils.ts              # Utils de Shadcn (cn function)
│   │   └── constants.ts          # Constantes globales
│   │
│   ├── types/                    # Tipos globales compartidos
│   │   ├── database.types.ts     # Tipos generados de Supabase
│   │   └── common.types.ts       # Tipos comunes (Pagination, ApiResponse, etc.)
│   │
│   └── styles/
│       └── globals.css           # Tailwind + CSS variables (tema claro/oscuro)
│
└── tests/
    ├── unit/
    │   ├── schemas/
    │   └── utils/
    ├── integration/
    │   ├── auth.test.ts
    │   ├── product.test.ts
    │   └── search.test.ts
    └── e2e/
        ├── search.spec.ts
        └── checkout-flow.spec.ts
```

## Principios de la Estructura

1. **Cada módulo es autónomo**: contiene sus propias acciones, schemas, hooks, componentes, repositorios y tipos.
2. **El módulo `shared`** contiene componentes y utilidades usados por múltiples módulos.
3. **Los Server Actions** son la capa de aplicación que orquesta dominio e infraestructura.
4. **Los repositorios** son la única capa que toca Supabase directamente.
5. **Los tipos del dominio** viven dentro de cada módulo, no en una carpeta global.
6. **Los componentes UI de Shadcn** viven en `components/ui/` separados de los componentes de dominio.
7. **Los grupos de rutas** `(public)`, `(auth)`, `(protected)`, `(seller)`, `(admin)` organizan layouts sin afectar URLs.
