# 13 — Plan de Sprints

## Configuración

- **Duración del sprint:** 2 semanas
- **Velocidad estimada del equipo:** 25-30 story points por sprint
- **Equipo:** 1-2 desarrolladores full-stack
- **Total MVP:** ~93 story points (Must Have) + ~44 (Should Have) = ~137 SP
- **Duración estimada:** 6 sprints (12 semanas)

---

## Sprint 1: Fundaciones (Semanas 1-2)

**Objetivo:** Setup del proyecto, base de datos y autenticación

| Item | SP | Responsable |
|---|---|---|
| M-29: Configuración base del proyecto (Next.js 15, Tailwind, Shadcn, PWA) | 5 | Dev 1 |
| M-30: Esquema de base de datos completo | 5 | Dev 2 |
| M-31: RLS y triggers | 5 | Dev 2 |
| M-01: Registro con email | 3 | Dev 1 |
| M-02: Registro con Google | 3 | Dev 1 |
| M-03: Login con email | 2 | Dev 1 |
| M-04: Login con Google | 2 | Dev 1 |
| M-33: Tema claro/oscuro | 2 | Dev 1 |

**Total:** 27 SP

**Entregables:**
- Proyecto Next.js 15 corriendo con TailwindCSS y Shadcn UI
- Base de datos Supabase con todas las tablas, RLS y triggers
- Registro y login funcionando (email + Google)
- Tema claro/oscuro operativo
- PWA manifest configurado

---

## Sprint 2: Negocio y Productos (Semanas 3-4)

**Objetivo:** Vendedor puede crear su negocio y gestionar productos

| Item | SP | Responsable |
|---|---|---|
| M-07: Crear negocio | 5 | Dev 1 |
| M-08: Editar negocio | 3 | Dev 1 |
| M-09: Crear producto | 5 | Dev 2 |
| M-10: Editar producto | 3 | Dev 2 |
| M-11: Eliminar producto | 2 | Dev 2 |
| M-12: Ver lista de mis productos | 3 | Dev 2 |
| M-05: Recuperar contraseña | 2 | Dev 1 |
| M-06: Cerrar sesión | 1 | Dev 1 |

**Total:** 24 SP

**Entregables:**
- Formulario completo de creación/edición de negocio
- CRUD completo de productos con imágenes
- Lista de productos del vendedor con acciones
- Recuperación de contraseña
- Layout del dashboard del vendedor

---

## Sprint 3: Búsqueda y Catálogo Público (Semanas 5-6)

**Objetivo:** Compradores pueden buscar y ver productos

| Item | SP | Responsable |
|---|---|---|
| M-13: Búsqueda por texto | 5 | Dev 1 |
| M-14: Filtrar por categoría | 3 | Dev 1 |
| M-15: Ordenar resultados | 2 | Dev 1 |
| M-16: Ver galería de imágenes | 3 | Dev 2 |
| M-17: Ver información del negocio | 2 | Dev 2 |
| M-18: Contactar por WhatsApp | 2 | Dev 2 |
| M-28: Experiencia responsive | 5 | Ambos |
| M-32: SEO: Meta tags, sitemap, robots | 3 | Dev 1 |

**Total:** 25 SP

**Entregables:**
- Página de búsqueda con filtros y ordenamiento
- Página de detalle de producto con galería y WhatsApp
- Diseño responsive completo (mobile, tablet, desktop)
- SEO básico funcionando (meta tags, sitemap, robots)

---

## Sprint 4: Favoritos, Dashboard y Admin (Semanas 7-8)

**Objetivo:** Funcionalidades de comprador y panel admin

| Item | SP | Responsable |
|---|---|---|
| M-19: Agregar a favoritos | 3 | Dev 1 |
| M-20: Eliminar de favoritos | 1 | Dev 1 |
| M-21: Ver mis favoritos | 2 | Dev 1 |
| M-22: Ver total de visitas | 3 | Dev 2 |
| M-23: Ver clicks de WhatsApp | 2 | Dev 2 |
| M-24: Ver cantidad de productos | 1 | Dev 2 |
| M-25: Dashboard admin | 3 | Dev 2 |
| M-26: Gestionar categorías | 5 | Dev 1 |
| M-27: Instalar como app (PWA) | 3 | Dev 2 |

**Total:** 23 SP

**Entregables:**
- Sistema de favoritos completo
- Dashboard del vendedor con métricas
- Panel admin con gestión de categorías
- PWA instalable con service worker

---

## Sprint 5: Refinamiento Should Have (Semanas 9-10)

**Objetivo:** Features importantes de segunda prioridad

| Item | SP | Responsable |
|---|---|---|
| S-01: Ver y editar perfil | 2 | Dev 1 |
| S-02: Pausar negocio | 2 | Dev 1 |
| S-03: Ver página pública del negocio | 3 | Dev 1 |
| S-04: Marcar producto como destacado | 2 | Dev 2 |
| S-05: Gestionar stock y disponibilidad | 2 | Dev 2 |
| S-06: Filtrar por ubicación | 3 | Dev 1 |
| S-07: Filtrar por precio | 3 | Dev 2 |
| S-08: Paginación infinita | 3 | Dev 1 |
| S-10: Compartir producto | 2 | Dev 2 |
| S-16: Tema oscuro refinamiento | 2 | Dev 1 |

**Total:** 24 SP

**Entregables:**
- Página pública de negocio
- Filtros avanzados (ubicación, precio)
- Paginación infinita
- Compartir producto
- Gestión de perfil y stock

---

## Sprint 6: Pulido y SEO Avanzado (Semanas 11-12)

**Objetivo:** Optimización, SEO avanzado y preparación para lanzamiento

| Item | SP | Responsable |
|---|---|---|
| S-09: Ver productos relacionados | 3 | Dev 1 |
| S-11: Ver productos más vistos | 2 | Dev 2 |
| S-12: Ver favoritos recibidos | 2 | Dev 2 |
| S-13: Gestionar usuarios (admin) | 3 | Dev 1 |
| S-14: Gestionar negocios (admin) | 3 | Dev 2 |
| S-15: Navegación offline básica | 3 | Dev 1 |
| S-17: Schema.org structured data | 3 | Dev 2 |
| S-18: Open Graph images dinámicas | 3 | Dev 1 |
| Bug fixing y testing | 5 | Ambos |

**Total:** 27 SP

**Entregables:**
- Productos relacionados
- Gestión de usuarios y negocios (admin)
- Offline básico con service worker
- Schema.org y OG images
- Bugs corregidos
- MVP listo para lanzamiento

---

## Resumen de Sprints

| Sprint | SP | Foco Principal |
|---|---|---|
| Sprint 1 | 27 | Fundaciones + Auth |
| Sprint 2 | 24 | Negocio + Productos |
| Sprint 3 | 25 | Búsqueda + Catálogo + Responsive |
| Sprint 4 | 23 | Favoritos + Dashboard + Admin + PWA |
| Sprint 5 | 24 | Refinamiento + Filtros avanzados |
| Sprint 6 | 27 | Pulido + SEO + Testing |
| **Total** | **150** | **MVP completo** |

---

## Ceremonias por Sprint

| Ceremonia | Duración | Frecuencia |
|---|---|---|
| Sprint Planning | 2h | Inicio del sprint |
| Daily Standup | 15min | Diario |
| Sprint Review | 1h | Fin del sprint |
| Sprint Retrospective | 1h | Fin del sprint |
| Backlog Refinement | 1h | Medio del sprint |

---

## Definición de "Ready" (DoR)

Un item está listo para entrar a un sprint cuando:
1. ✅ Historia de usuario escrita y estimada
2. ✅ Criterios de aceptación definidos
3. ✅ Dependencias resueltas
4. ✅ Diseño/wireframe disponible (si aplica)
5. ✅ Schema de base de datos definido (si aplica)
