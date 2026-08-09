# 01 — Documento Funcional

## 1. Resumen Ejecutivo

**Nombre del producto:** Catáloga (nombre tentativo)

**Propósito:** Plataforma SaaS que funciona como catálogo inteligente para organizar los productos y servicios que actualmente se venden en grupos de WhatsApp. La plataforma **no compite** con WhatsApp; lo complementa actuando como escaparate estructurado, mientras WhatsApp permanece como canal de comunicación directo entre comprador y vendedor.

**Problema que resuelve:** Los compradores deben revisar cientos de mensajes en grupos de WhatsApp para encontrar un producto. Los vendedores no tienen visibilidad estructurada ni analítica de su catálogo.

**Solución:** Un catálogo web (PWA) donde los vendedores publican sus productos con fotos, precios y categorías, y los compradores los encuentran mediante búsqueda avanzada, filtros y categorización. El contacto se realiza vía WhatsApp con un solo clic.

---

## 2. Objetivos del MVP

| Objetivo | Métrica de éxito |
|---|---|
| Validar que los vendedores quieren publicar su catálogo | ≥ 50 vendedores registrados en el primer mes |
| Validar que los compradores encuentran productos rápidamente | Tiempo de búsqueda < 3 clics |
| Validar el interés de contacto vía WhatsApp | ≥ 30% de visitantes hace clic en "Contactar por WhatsApp" |
| Validar retención de vendedores | ≥ 60% de vendedores publica al menos 5 productos |

---

## 3. Tipos de Usuario

| Tipo | Descripción | Permisos |
|---|---|---|
| **Administrador** | Gestiona la plataforma | Acceso total: usuarios, negocios, productos, categorías, moderación, reportes |
| **Vendedor** | Publica su catálogo | CRUD de su negocio y productos, acceso a dashboard analítico |
| **Comprador** | Busca productos | Búsqueda, favoritos, contacto por WhatsApp |
| **Visitante** | Navega sin registro | Búsqueda y visualización de productos, sin favoritos ni dashboard |

---

## 4. Módulos del MVP

### 4.1 Autenticación

- Registro con correo electrónico y contraseña
- Registro/Login con Google OAuth
- Login con correo y contraseña
- Recuperación de contraseña (email reset link)
- Perfil de usuario (nombre, avatar, teléfono)
- Cerrar sesión
- Un usuario puede ser vendedor y comprador simultáneamente (rol asignado al crear negocio)

### 4.2 Perfil del Negocio

Cada vendedor gestiona un negocio con:

- Logo (imagen)
- Nombre
- Descripción
- Categoría (de catálogo predefinido)
- Dirección
- Ciudad
- Comuna
- WhatsApp (número con código de país)
- Instagram (URL opcional)
- Facebook (URL opcional)
- Horario de atención (texto estructurado o libre)
- Ubicación en mapa (lat/lng opcional)
- Estado: Activo / Inactivo

### 4.3 Productos

CRUD completo. Cada producto tiene:

- Nombre
- Descripción
- Precio (con moneda)
- Fotos (hasta 5 imágenes)
- Categoría
- Subcategoría
- Stock (numérico o "ilimitado")
- Disponibilidad (disponible / agotado)
- Producto destacado (boolean)
- Estado (publicado / borrador)
- SKU opcional

### 4.4 Buscador

- Búsqueda por texto (nombre, descripción, negocio)
- Filtros:
  - Categoría
  - Subcategoría
  - Ciudad
  - Comuna
  - Rango de precio
- Ordenamiento:
  - Más recientes
  - Más vistos
  - Precio ascendente
  - Precio descendente
- Paginación infinita (lazy loading)

### 4.5 Página del Producto

- Galería de imágenes (carrusel)
- Nombre, precio, descripción
- Información del negocio (nombre, logo, categoría, ubicación)
- Productos relacionados (misma categoría/subcategoría)
- Botón "Contactar por WhatsApp" (abre WhatsApp con mensaje pre-escrito)
- Botón "Compartir" (Web Share API + copiar link)
- Botón "Favorito" (requiere login)

### 4.6 Favoritos

- Guardar producto como favorito (requiere login)
- Eliminar de favoritos
- Lista de favoritos del comprador
- Indicador visual de favorito en tarjetas de producto

### 4.7 Dashboard del Vendedor

Métricas mostradas:

- Total de visitas a sus productos
- Productos publicados (cantidad)
- Productos más vistos (top 5)
- Clicks al botón de WhatsApp
- Cantidad de favoritos recibidos
- Gráfico simple de vistas en últimos 30 días

### 4.8 Panel Administrador

- Dashboard general (usuarios, negocios, productos totales)
- Gestión de usuarios (ver, suspender)
- Gestión de negocios (ver, activar/desactivar)
- Gestión de productos (ver, eliminar)
- Gestión de categorías y subcategorías (CRUD)
- Reportes básicos (exportar CSV)
- Moderación de contenido (aprobar/rechazar productos reportados)

---

## 5. Funcionalidades Excluidas del MVP

- Carrito de compras
- Pagos online
- Comisiones
- Despacho / logística
- Facturación
- Chat interno
- Inteligencia artificial
- Sistema de promociones
- Programa de fidelización
- Publicidad / ads

---

## 6. Analíticas a Registrar

| Evento | Actor | Datos |
|---|---|---|
| Producto visto | Comprador/Visitante | product_id, timestamp, source |
| Búsqueda realizada | Comprador/Visitante | query, filtros, resultados_count |
| Click WhatsApp | Comprador/Visitante | product_id, business_id, timestamp |
| Negocio visitado | Comprador/Visitante | business_id, timestamp |
| Producto agregado a favoritos | Comprador | product_id, timestamp |
| Producto publicado | Vendedor | product_id, category_id, timestamp |

---

## 7. Requisitos No Funcionales

### 7.1 Plataforma

- Progressive Web App (PWA) instalable desde navegador
- Responsive: Desktop, Tablet, Android, iPhone
- Manifest.json + Service Worker + offline básico
- Tema claro y oscuro

### 7.2 Rendimiento

- Lazy loading de imágenes y rutas
- Code splitting por módulo
- Optimización de imágenes (next/image)
- Cache estratégico
- ISR (Incremental Static Regeneration) donde sea posible
- LCP < 2.5s en landing y búsqueda

### 7.3 SEO

- Meta tags dinámicos por página
- Open Graph tags
- Sitemap.xml dinámico
- Robots.txt
- URLs amigables (/producto/[slug], /negocio/[slug])
- Schema.org (Product, LocalBusiness, BreadcrumbList)

### 7.4 Seguridad

- JWT vía Supabase Auth
- Row Level Security (RLS) en todas las tablas
- Validación de formularios con Zod
- Protección CSRF (SameSite cookies)
- Protección XSS (React + sanitización)
- Protección SQL Injection (Supabase parametriza queries)

### 7.5 Accesibilidad

- Navegación por teclado
- ARIA labels en componentes interactivos
- Contraste WCAG AA
- Alt text en imágenes

---

## 8. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Estilos | TailwindCSS + Shadcn UI |
| Formularios | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime, RLS, Edge Functions) |
| PWA | next-pwa o implementación manual de Service Worker |
| Mapas | No incluido en MVP (solo lat/lng almacenado, mapa en fase posterior) |

---

## 9. Criterios de Éxito del MVP

1. Un vendedor puede registrar su negocio y publicar 5 productos en menos de 10 minutos.
2. Un comprador puede encontrar un producto específico en menos de 3 clics desde la home.
3. La plataforma funciona offline en navegación básica (caché de páginas visitadas).
4. La plataforma es instalable como app en Android e iOS.
5. El dashboard del vendedor muestra métricas en tiempo real.
