# 11 — Backlog del MVP

## Priorización MoSCoW

- 🔴 **Must Have**: Imprescindible para el MVP
- 🟡 **Should Have**: Importante pero no bloqueante
- 🟢 **Could Have**: Deseable si hay tiempo
- ⚪ **Won't Have**: Excluido del MVP

---

## Backlog Ordenado por Prioridad

### 🔴 Must Have (Sprint 1-4)

| ID | Historia | Módulo | Estimación |
|---|---|---|---|
| M-01 | US-01: Registro con email | Auth | 3 |
| M-02 | US-02: Registro con Google | Auth | 3 |
| M-03 | US-03: Login con email | Auth | 2 |
| M-04 | US-04: Login con Google | Auth | 2 |
| M-05 | US-05: Recuperar contraseña | Auth | 2 |
| M-06 | US-07: Cerrar sesión | Auth | 1 |
| M-07 | US-08: Crear negocio | Business | 5 |
| M-08 | US-09: Editar negocio | Business | 3 |
| M-09 | US-12: Crear producto | Product | 5 |
| M-10 | US-13: Editar producto | Product | 3 |
| M-11 | US-14: Eliminar producto | Product | 2 |
| M-12 | US-17: Ver lista de mis productos | Product | 3 |
| M-13 | US-18: Búsqueda por texto | Search | 5 |
| M-14 | US-19: Filtrar por categoría | Search | 3 |
| M-15 | US-22: Ordenar resultados | Search | 2 |
| M-16 | US-24: Ver galería de imágenes | Product | 3 |
| M-17 | US-25: Ver información del negocio | Product | 2 |
| M-18 | US-27: Contactar por WhatsApp | Product | 2 |
| M-19 | US-29: Agregar a favoritos | Favorites | 3 |
| M-20 | US-30: Eliminar de favoritos | Favorites | 1 |
| M-21 | US-31: Ver mis favoritos | Favorites | 2 |
| M-22 | US-32: Ver total de visitas | Dashboard | 3 |
| M-23 | US-34: Ver clicks de WhatsApp | Dashboard | 2 |
| M-24 | US-36: Ver cantidad de productos | Dashboard | 1 |
| M-25 | US-37: Dashboard admin | Admin | 3 |
| M-26 | US-40: Gestionar categorías | Admin | 5 |
| M-27 | US-43: Instalar como app (PWA) | PWA | 3 |
| M-28 | US-46: Experiencia responsive | Global | 5 |
| M-29 | Configuración base del proyecto | Setup | 5 |
| M-30 | Esquema de base de datos completo | DB | 5 |
| M-31 | RLS y triggers | DB | 5 |
| M-32 | SEO: Meta tags, sitemap, robots | SEO | 3 |
| M-33 | Tema claro/oscuro | UI | 2 |

**Total Must Have:** 33 items — ~93 story points

### 🟡 Should Have (Sprint 5-6)

| ID | Historia | Módulo | Estimación |
|---|---|---|---|
| S-01 | US-06: Ver y editar perfil | Auth | 2 |
| S-02 | US-10: Pausar negocio | Business | 2 |
| S-03 | US-11: Ver página pública del negocio | Business | 3 |
| S-04 | US-15: Marcar producto como destacado | Product | 2 |
| S-05 | US-16: Gestionar stock y disponibilidad | Product | 2 |
| S-06 | US-20: Filtrar por ubicación | Search | 3 |
| S-07 | US-21: Filtrar por precio | Search | 3 |
| S-08 | US-23: Paginación infinita | Search | 3 |
| S-09 | US-26: Ver productos relacionados | Product | 3 |
| S-10 | US-28: Compartir producto | Product | 2 |
| S-11 | US-33: Ver productos más vistos | Dashboard | 2 |
| S-12 | US-35: Ver favoritos recibidos | Dashboard | 2 |
| S-13 | US-38: Gestionar usuarios (admin) | Admin | 3 |
| S-14 | US-39: Gestionar negocios (admin) | Admin | 3 |
| S-15 | US-44: Navegación offline básica | PWA | 3 |
| S-16 | US-45: Tema oscuro (refinamiento) | UI | 2 |
| S-17 | Schema.org structured data | SEO | 3 |
| S-18 | Open Graph images dinámicas | SEO | 3 |

**Total Should Have:** 18 items — ~44 story points

### 🟢 Could Have (Post-MVP)

| ID | Historia | Módulo | Estimación |
|---|---|---|---|
| C-01 | US-41: Moderar productos (admin) | Admin | 5 |
| C-02 | US-42: Exportar reportes CSV | Admin | 3 |
| C-03 | Notificaciones push | PWA | 5 |
| C-04 | Búsqueda con autocompletado | Search | 3 |
| C-05 | Filtros por comuna dependientes | Search | 2 |

### ⚪ Won't Have (Excluido del MVP)

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
- Mapa interactivo
- Notificaciones push (post-MVP)

---

## Dependencias Clave

```
M-29 Setup proyecto
  └── M-30 Esquema BD
       └── M-31 RLS y triggers
            ├── M-01 Registro email
            │    └── M-03 Login email
            ├── M-07 Crear negocio
            │    ├── M-09 Crear producto
            │    │    ├── M-13 Búsqueda texto
            │    │    └── M-18 Contactar WhatsApp
            │    └── M-22 Dashboard visitas
            └── M-26 Gestionar categorías (admin)
```

---

## Criterios de "Done" Global

Para que un item del backlog se considere **Done** debe:

1. ✅ Código escrito en TypeScript con tipado completo
2. ✅ Validación Zod en cliente y servidor
3. ✅ RLS aplicado en base de datos
4. ✅ Componente responsive (mobile, tablet, desktop)
5. ✅ Funciona en tema claro y oscuro
6. ✅ SEO optimizado (meta tags si aplica)
7. ✅ Lazy loading si aplica
8. ✅ Sin errores en consola
9. ✅ Documentación inline (JSDoc en funciones complejas)
10. ✅ Tests básicos de integración
