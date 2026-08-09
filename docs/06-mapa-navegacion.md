# 06 — Mapa de Navegación

## 1. Mapa General

```
                         ┌──────────┐
                         │   HOME   │
                         │  (/)     │
                         └────┬─────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
    ┌──────▼─────┐    ┌──────▼─────┐    ┌───────▼──────┐
    │  BUSCADOR   │    │  PRODUCTO  │    │   NEGOCIO    │
    │ /buscar     │    │ /producto/ │    │  /negocio/   │
    │             │    │   [slug]   │    │   [slug]     │
    └──────┬──────┘    └──────┬─────┘    └──────┬───────┘
           │                  │                 │
           │           ┌──────┴──────┐         │
           │           │             │         │
           │    ┌──────▼─────┐ ┌────▼─────┐   │
           │    │  WHATSAPP  │ │ FAVORITO │   │
           │    │  (externo) │ │ (toggle) │   │
           │    └────────────┘ └──────────┘   │
           │                                    │
    ┌──────▼──────┐                    ┌───────▼──────┐
    │  CATEGORÍA  │                    │  PRODUCTOS   │
    │ /categoria/ │                    │  DEL negocio │
    │   [slug]    │                    └──────────────┘
    └─────────────┘

    ┌──────────┐
    │  LOGIN   │ ←── /login
    │ /login   │
    └────┬─────┘
         │
    ┌────▼─────┐
    │ REGISTRO │ ←── /registro
    │/registro │
    └──────────┘

    ┌──────────────────┐
    │  RECUPERAR PASS  │ ←── /recuperar-password
    │ /recuperar-pass  │
    └──────────────────┘
```

## 2. Navegación por Rol

### 2.1 Visitante / Comprador

```
HOME (/)
├── Buscar (/buscar)
│   ├── Producto (/producto/[slug])
│   │   ├── WhatsApp (externo)
│   │   ├── Compartir (Web Share / clipboard)
│   │   └── Negocio (/negocio/[slug])
│   └── Categoría (/categoria/[slug])
├── Login (/login)
├── Registro (/registro)
├── Recuperar Password (/recuperar-password)
├── Login Google (OAuth redirect)
└── Páginas legales
    ├── /terminos
    └── /privacidad

[Si autenticado como comprador:]
├── Mis Favoritos (/favoritos)
├── Mi Perfil (/perfil)
│   └── Editar perfil
├── Cerrar sesión
└── Crear Negocio (/negocio/crear) → se convierte en vendedor
```

### 2.2 Vendedor

```
[Todo lo de comprador +]
├── Dashboard (/dashboard)
├── Mis Productos (/dashboard/productos)
│   ├── Nuevo Producto (/dashboard/productos/nuevo)
│   ├── Editar Producto (/dashboard/productos/[id]/editar)
│   └── Eliminar Producto (acción inline)
├── Mi Negocio (/dashboard/negocio)
│   └── Editar Negocio (/dashboard/negocio/editar)
└── Configuración (/dashboard/configuracion)
    └── Activar/Desactivar negocio
```

### 2.3 Administrador

```
[Todo lo de comprador +]
├── Panel Admin (/admin)
│   ├── Dashboard (/admin)
│   ├── Usuarios (/admin/usuarios)
│   ├── Negocios (/admin/negocios)
│   ├── Productos (/admin/productos)
│   ├── Categorías (/admin/categorias)
│   │   ├── Nueva Categoría
│   │   ├── Editar Categoría
│   │   └── Subcategorías
│   ├── Moderación (/admin/moderacion)
│   └── Reportes (/admin/reportes)
│       └── Exportar CSV
```

## 3. Rutas Protegidas

| Ruta | Rol requerido | Redirect si no autorizado |
|---|---|---|
| `/favoritos` | Comprador+ | `/login` |
| `/perfil` | Comprador+ | `/login` |
| `/dashboard/*` | Vendedor | `/login` |
| `/negocio/crear` | Comprador autenticado | `/login` |
| `/admin/*` | Admin | `/` (403) |

## 4. Navegación Mobile (Bottom Bar)

```
┌──────────────────────────────────┐
│           [Contenido]             │
├──────────────────────────────────┤
│ [🏠]    [🔍]    [♥]    [👤]      │
│ Home   Buscar  Favoritos Perfil  │
└──────────────────────────────────┘
```

- **Home:** visible siempre
- **Buscar:** visible siempre
- **Favoritos:** visible si autenticado, si no → redirect a login
- **Perfil:** visible si autenticado, si no → redirect a login
  - Si es vendedor: menú expandido con Dashboard, Productos, Negocio
  - Si es admin: acceso a Panel Admin

## 5. Navegación Desktop (Header)

```
┌────────────────────────────────────────────────────┐
│ [Logo] [Buscar...]  [Categorías] [☀️/🌙] [♥] [👤]  │
└────────────────────────────────────────────────────┘
```

- Dropdown de usuario (👤) muestra:
  - **No autenticado:** Login, Registro
  - **Comprador:** Mi Perfil, Mis Favoritos, Cerrar sesión, "Vender en Catáloga"
  - **Vendedor:** Mi Perfil, Mis Favoritos, Dashboard, Mis Productos, Mi Negocio, Cerrar sesión
  - **Admin:** Todo lo de vendedor + Panel Admin

## 6. Flujo de Onboarding del Vendedor

```
1. Usuario registrado (comprador)
   │
2. Click "Vender en Catáloga"
   │
3. ¿Tiene negocio? → No → /negocio/crear
   │                    │
   │                    ▼
   │              Formulario de negocio
   │                    │
   │                    ▼
   │              Negocio creado
   │                    │
   │                    ▼
   │              Redirect /dashboard
   │                    │
   │                    ▼
   │              "Crea tu primer producto"
   │                    │
   │                    ▼
   │              /dashboard/productos/nuevo
   │
   └──→ Sí → /dashboard
```

## 7. Flujo de Búsqueda a Contacto (Core UX)

```
1. Home
   │ (1er clic: buscar o categoría)
   ▼
2. Resultados de búsqueda
   │ (2do clic: producto)
   ▼
3. Página de producto
   │ (3er clic: Contactar por WhatsApp)
   ▼
4. WhatsApp externo con mensaje pre-escrito
```

**Objetivo: encontrar un producto en menos de 3 clics.**
