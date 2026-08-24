# 📘 Catáloga — Estado y Documentación del Sistema (MVP)

> **Versión:** 1.0.0 (MVP)  
> **Última actualización:** Agosto 2026  
> **Estado:** En Producción (Desplegado en Vercel + Supabase)  
> **Repositorio:** [GitHub / tylsonb / Cataloga-App](https://github.com/tylsonb/Cataloga-App)

---

## 1. Resumen Ejecutivo

**Catáloga** es un catálogo digital inteligente diseñado para conectar a pequeños y medianos comerciantes (que venden principalmente por grupos de WhatsApp y redes sociales) con compradores locales de forma directa, rápida y sin intermediarios.

### Propuesta de Valor:
- **Para Compradores:** Encuentran productos por nombre, categoría y ciudad con precios claros en su moneda local, y pueden contactar al vendedor por WhatsApp con el mensaje del producto pre-cargado con 1 solo clic.
- **Para Vendedores:** Crean su catálogo digital en minutos, suben fotos, administran inventario y reciben consultas directamente en su WhatsApp sin pagar comisiones por venta.
- **Formato PWA (Progressive Web App):** Se instala en teléfonos Android, iPhones o computadoras en menos de 30 segundos, ocupando menos de 2 MB y sin pasar por Google Play o App Store.

---

## 2. Arquitectura Tecnológica

El sistema está construido siguiendo las mejores prácticas modernas de desarrollo web con arquitectura Server-First y Renderizado Híbrido (SSR / RSC):

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND / APLICACIÓN                    │
│      Next.js 15 (App Router) + React 19 + TypeScript         │
│          Tailwind CSS + shadcn/ui + Lucide Icons            │
│          PWA (Service Worker + Manifest Standalone)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                Server Actions & REST APIs
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    BACKEND / BASE DE DATOS                  │
│                Supabase (Managed PostgreSQL 15)             │
│   • Auth (Email/Password + Google OAuth + SSR Cookies)      │
│   • Row Level Security (RLS) en todas las tablas            │
│   • Supabase Storage (Buckets de imágenes de productos)     │
│   • Triggers automáticos y Búsqueda Full-Text (GIN/tsvector)│
└─────────────────────────────────────────────────────────────┘
```

### Stack Detallado:
- **Framework Principal:** Next.js 15.1 (App Router, Server Components, Server Actions).
- **Lenguaje:** TypeScript 5.x con tipado estricto.
- **Estilos y UI:** Tailwind CSS 3.4, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Iconografía:** Lucide React.
- **Base de Datos & Auth:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`).
- **Validación de Esquemas:** Zod.
- **PWA:** Service Worker propio (`public/sw.js`), `manifest.json`, iconos adaptativos y detección de instalación en tiempo real.
- **Hosting & CI/CD:** Vercel (Producción y rama previews automáticos).

---

## 3. Modelo de Base de Datos y Entidades

El modelo relacional está optimizado en PostgreSQL con índices especializados y claves foráneas en cascada:

```
┌──────────────┐         ┌──────────────┐         ┌──────────────────┐
│   profiles   │ 1 ─── 1 │  user_roles  │         │    categories    │
│ (auth.users) │         │ (role: enum) │         │   (id, name...)  │
└──────┬───────┘         └──────────────┘         └────────┬─────────┘
       │                                                   │ 1
       │ 1                                                 │
       │                                                   │ N
┌──────▼───────┐ 1       N ┌──────────────┐ 1       N ┌────▼─────────────┐
│  businesses  ├───────────►   products   ├───────────►  product_images  │
│(owner_id...) │           │ (price, cur) │           │ (url, sort_order)│
└──────┬───────┘           └──────┬───┬───┘           └──────────────────┘
       │                          │   │
       │ 1                        │ 1 │ 1
       │                          │   │
       │ N                        │ N │ N
┌──────▼───────────┐       ┌──────▼───▼──┐     ┌──────────────────────┐
│ whatsapp_clicks  │       │product_views│     │      favorites       │
│(analytics clics) │       │ (visitas)   │     │ (user_id, product_id)│
└──────────────────┘       └─────────────┘     └──────────────────────┘
```

### Tablas Principales:

1. **`profiles`**: Perfil de usuario extendido a partir de `auth.users` (nombre, teléfono, avatar, email).
2. **`user_roles`**: Control de roles de usuario (`buyer`, `seller`, `admin`).
3. **`categories` & `subcategories`**: Clasificación jerárquica de productos con iconos y slugs únicos.
4. **`businesses`**: Negocios registrados por vendedores (WhatsApp, ciudad, dirección, redes sociales, horarios).
5. **`products`**: Productos del catálogo (nombre, descripción, precio, moneda, estado `published`/`draft`, conteo de visitas `view_count`, borrado lógico `deleted_at`).
6. **`product_images`**: Galería de fotos por producto con orden configurable (`sort_order`).
7. **`favorites`**: Productos marcados como favoritos por compradores autenticados.
8. **`product_views`**: Registro analítico de visualizaciones de productos.
9. **`whatsapp_clicks`**: Registro de intenciones de compra (clics en el botón de WhatsApp).

---

## 4. Seguridad y Políticas RLS (Row Level Security)

Todas las tablas de la base de datos cuentan con políticas RLS activadas para garantizar aislamiento de datos:

- **Lectura Pública:** Cualquier usuario (incluso no registrado) puede ver negocios activos, categorías y productos publicados (`status = 'published'` y `deleted_at IS NULL`).
- **Edición de Vendedor:** Un vendedor solo puede crear, modificar o eliminar productos pertenecientes a su propio negocio (`ownsBusiness`).
- **Favoritos:** Cada usuario solo puede ver y gestionar su propia lista de favoritos.
- **Panel Administrador:** Acceso restringido exclusivamente a usuarios con rol `admin` verificado en base de datos.
- **Almacenamiento (Supabase Storage):**
  - `product-images`: Lectura pública; subida permitida únicamente a usuarios autenticados.
  - `business-logos`: Lectura pública; subida permitida a usuarios autenticados.
  - `user-avatars`: Lectura pública; subida permitida al dueño del perfil.

---

## 5. Mapeo de Rutas de la Aplicación

### 🌐 Rutas Públicas
| Ruta | Descripción |
|---|---|
| `/` | Portada principal: Buscador, categorías, productos destacados y banner PWA. |
| `/app` | Landing Page informativa del MVP con guía de instalación paso a paso para Android, iPhone y PC. |
| `/instalar` | Redirección directa hacia `/app`. |
| `/buscar` | Buscador interactivo de productos con filtros por nombre y categoría. |
| `/categoria/[slug]` | Explorador de productos filtrados por categoría. |
| `/producto/[slug]` | Ficha completa del producto con galería de fotos, precio con bandera, botón directo a WhatsApp y botón de favoritos. |
| `/negocio/[slug]` | Perfil público de un negocio con todos sus productos publicados. |
| `/terminos` | Términos y condiciones del servicio. |
| `/privacidad` | Políticas de privacidad y tratamiento de datos. |

### 🔐 Rutas de Autenticación
| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión con correo/contraseña o botón de Google OAuth. |
| `/registro` | Registro de nuevos usuarios y vendedores. |
| `/auth/callback` | Endpoint de intercambio de tokens OAuth y confirmación de sesión. |

### 🛍️ Rutas Protegidas (Comprador & Vendedor)
| Ruta | Descripción |
|---|---|
| `/favoritos` | Listado de productos guardados por el comprador. |
| `/perfil` | Edición de datos personales, teléfono y foto de perfil. |
| `/negocio/crear` | Asistente de registro inicial de un negocio/tienda. |
| `/dashboard` | Panel principal del vendedor con métricas de visitas y clics. |
| `/dashboard/productos` | Tabla de gestión de inventario del vendedor. |
| `/dashboard/productos/nuevo` | Formulario de creación de producto con selector de moneda multimoneda y subida de hasta 5 fotos. |
| `/dashboard/productos/[id]/editar` | Formulario de edición de producto existente. |
| `/dashboard/negocio` | Configuración de datos del negocio y número de WhatsApp. |

### 🛡️ Rutas de Administración
| Ruta | Descripción |
|---|---|
| `/admin` | Panel de control global con métricas totales de la plataforma. |
| `/admin/negocios` | Gestión y moderación de negocios registrados. |
| `/admin/productos` | Moderación, publicación o eliminación de productos globales. |
| `/admin/categorias` | Creación y ordenamiento de categorías y subcategorías. |

---

## 6. Funcionalidades Destacadas Implementadas

### 1. Sistema Multimoneda con Banderas
El sistema soporta 8 monedas latinoamericanas e internacionales con formateo inteligente y banderas nacionales:
- 🇻🇪 **Bolívar Venezolano:** `🇻🇪 Bs. 1.500 VES`
- 🇵🇪 **Sol Peruano:** `🇵🇪 S/ 150 PEN`
- 🇨🇱 **Peso Chileno:** `🇨🇱 $15.000 CLP`
- 🇨🇴 **Peso Colombiano:** `🇨🇴 $50.000 COP`
- 🇺🇸 **Dólar Estadounidense:** `🇺🇸 US$ 25 USD`
- 🇲🇽 **Peso Mexicano:** `🇲🇽 $500 MXN`
- 🇦🇷 **Peso Argentino:** `🇦🇷 $2.000 ARS`
- 🇪🇺 **Euro:** `🇪🇺 €50 EUR`

### 2. Detección Inteligente de PWA (App Instalada)
- Cuando el usuario visita Catáloga desde el navegador web, ve la invitación a instalar la app.
- Cuando el usuario abre la aplicación instalada desde su pantalla de inicio (`display-mode: standalone`), el banner promocional y el enlace "App Móvil" se ocultan automáticamente para ofrecer una experiencia 100% limpia de app nativa.

### 3. Contacto Directo por WhatsApp con Pre-Carga
Al hacer clic en el botón *"Contactar por WhatsApp"*, el sistema genera un enlace directo con el mensaje:
> *"Hola, estoy interesado en [Nombre del Producto] que vi en Catáloga"*  
y registra la métrica en la tabla `whatsapp_clicks`.

---

## 7. Parámetros Técnicos y Límites Actuales

| Parámetro | Límite Actual en MVP | Ubicación en Código |
|---|---|---|
| **Tamaño máx. por foto** | **2 MB** (JPG, PNG, WEBP, AVIF) | `src/modules/product/components/image-uploader.tsx` |
| **Fotos por producto** | **Hasta 5 fotos** | `src/lib/constants.ts` (`MAX_PRODUCT_IMAGES`) |
| **Productos por negocio** | **Ilimitado** (fase de captación) | Configurable para planes de monetización |
| **Negocios por vendedor** | **1 negocio** por cuenta | Esquema de base de datos (`owner_id UNIQUE`) |

---

## 8. Guía de Ejecución Local y Despliegue

### Requisitos Previos:
- Node.js 18+ o 20+.
- Cuenta de Supabase con el esquema ejecutado.

### Instalación:
```bash
# 1. Clonar el repositorio
git clone https://github.com/tylsonb/Cataloga-App.git
cd Cataloga-App

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Comandos de Verificación:
```bash
npm run type-check    # Verifica tipos TypeScript
npm run test          # Ejecuta suite de pruebas unitarias e integración
npm run build         # Compilación de producción
```
