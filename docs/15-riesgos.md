# 15 — Riesgos

## Matriz de Riesgos

| ID | Riesgo | Probabilidad | Impacto | Severidad | Mitigación |
|---|---|---|---|---|---|
| R-01 | Baja adopción de vendedores | Media | Alto | 🔴 Alta | Onboarding simplificado, importar catálogo desde WhatsApp, tutorial guiado |
| R-02 | Vendedores publican pocos productos | Media | Alto | 🔴 Alta | Formulario rápido, guiar con "crea tu primer producto", mostrar beneficios del catálogo completo |
| R-03 | Compradores no encuentran productos relevantes | Media | Alto | 🔴 Alta | Búsqueda full-text optimizada, categorías bien definidas, productos destacados en home |
| R-04 | Lentitud en búsqueda con muchos productos | Baja | Medio | 🟡 Media | Índices en BD, paginación, ISR en listados, búsqueda full-text con GIN index |
| R-05 | Imágenes pesadas degradan rendimiento | Media | Medio | 🟡 Media | Compresión client-side antes de upload, next/image optimization, lazy loading |
| R-06 | Abuso del botón WhatsApp por bots | Baja | Bajo | 🟢 Baja | Rate limiting en Edge Function, CAPTCHA si se detecta abuso |
| R-07 | Contenido inapropiado en productos | Media | Medio | 🟡 Media | Panel de moderación admin, reportes de usuarios, flag automático en productos sin imágenes |
| R-08 | Supabase limites del plan free | Baja | Medio | 🟡 Media | Monitorear uso, migrar a plan pago antes de alcanzar límites, optimizar queries |
| R-09 | Incompatibilidad PWA en iOS Safari | Media | Bajo | 🟡 Media | Testing exhaustivo en iOS, fallbacks para features no soportadas, usar polyfills |
| R-10 | Pérdida de datos por error humano | Baja | Alto | 🟡 Media | Backups automáticos de Supabase, soft delete en productos, auditoría de cambios |
| R-11 | Problemas de CORS o configuración de Supabase | Baja | Medio | 🟢 Baja | Documentación de configuración, variables de entorno validadas al startup |
| R-12 | SEO insuficiente para indexación | Media | Alto | 🔴 Alta | SSR/ISR en páginas públicas, sitemap dinámico, Schema.org, Google Search Console |
| R-13 | Scalabilidad de RLS con muchos usuarios | Baja | Medio | 🟢 Baja | Políticas RLS optimizadas con índices, funciones STABLE, monitorear query plans |
| R-14 | Dependencia de WhatsApp como canal único | Media | Medio | 🟡 Media | MVP no compite con WhatsApp, pero preparar integración con Telegram/otro en roadmap |
| R-15 | Scope creep durante desarrollo | Alta | Medio | 🔴 Alta | Backlog priorizado MoSCoW, sprints estrictos, rechazar features fuera del MVP |

---

## Riesgos Técnicos Detallados

### R-04: Lentitud en búsqueda

**Escenario:** Con 10.000+ productos, las búsquedas con múltiples filtros pueden ser lentas.

**Síntomas:**
- Tiempo de respuesta > 2s en búsqueda
- Timeouts en queries complejas

**Mitigación:**
- Índice GIN en `to_tsvector` para búsqueda full-text
- Índices B-tree en columnas de filtro (category_id, city, price, created_at)
- Paginación con `LIMIT/OFFSET` o cursor-based
- ISR en páginas de categoría (cache 1h)
- Considerar Meilisearch/Elasticsearch en Fase 3

### R-05: Imágenes pesadas

**Escenario:** Vendedores suben fotos de 5MB+ desde su teléfono.

**Mitigación:**
- Compresión client-side con Canvas API antes de upload (máx 500KB)
- `next/image` para servir imágenes optimizadas (WebP, AVIF)
- Lazy loading con Intersection Observer
- Placeholder blur mientras carga
- Máximo 5 imágenes por producto

### R-09: PWA en iOS

**Escenario:** iOS Safari tiene soporte limitado para PWA.

**Limitaciones conocidas:**
- No soporta Web Push Notifications (hasta iOS 16.4+)
- Service Worker tiene limitaciones de caché
- "Add to Home Screen" es manual (no hay prompt automático)

**Mitigación:**
- Instrucciones visuales para instalar en iOS
- No depender de Web Push en MVP
- Service Worker con estrategias conservadoras
- Testing en Safari iOS real

### R-13: RLS con escala

**Escenario:** Con muchos usuarios, las políticas RLS con subqueries pueden ser lentas.

**Mitigación:**
- Funciones `is_admin()` y `is_owner_of_business()` marcadas como `STABLE`
- Índices en columnas usadas por RLS (owner_id, business_id)
- Evitar subqueries anidadas en políticas
- Monitorear query plans con `EXPLAIN ANALYZE`
- Considerar denormalización en fase de escala si es necesario

---

## Riesgos de Negocio

### R-01: Baja adopción de vendedores

**Escenario:** Los vendedores acostumbrados a WhatsApp no ven valor en migrar a una plataforma.

**Mitigación:**
- **No pedir que abandonen WhatsApp** — la plataforma complementa WhatsApp
- Onboarding en menos de 10 minutos
- Mostrar valor inmediato: "Tu catálogo organizado, compradores te encuentran fácil"
- Importar productos existentes (en roadmap futuro: importar desde fotos de WhatsApp)
- Marketing dirigido a grupos de WhatsApp de vendedores

### R-03: Compradores no encuentran productos

**Escenario:** Catálogo vacío o desbalanceado, compradores se van sin interactuar.

**Mitigación:**
- Seed inicial con vendedores beta (invitación directa)
- Productos destacados en home
- Categorías populares visibles
- Búsqueda con tolerancia a errores (tsvector con stemming)
- Mostrar "productos recientes" si no hay destacados

---

## Plan de Contingencia

| Riesgo | Trigger | Acción |
|---|---|---|
| R-04 Lentitud | P95 búsqueda > 1.5s | Optimizar queries, añadir índices, activar ISR |
| R-08 Límites Supabase | Uso > 80% del plan | Migrar a plan Pro ($25/mes) |
| R-12 SEO bajo | < 100 páginas indexadas en 30 días | Auditar con Search Console, mejorar sitemap, solicitar indexación |
| R-15 Scope creep | Sprints se retrasan > 20% | Congelar backlog, eliminar Should Have si es necesario |
| R-01 Baja adopción | < 20 vendedores en 30 días | Entrevistas con usuarios, ajustar propuesta de valor, onboarding guiado |

---

## Monitoreo de Riesgos

| Métrica | Herramienta | Frecuencia | Alerta si |
|---|---|---|---|
| Tiempo de respuesta búsqueda | Supabase Dashboard / Vercel Analytics | Diario | P95 > 1.5s |
| Uso de Supabase | Supabase Dashboard | Semanal | > 80% del plan |
| Páginas indexadas en Google | Google Search Console | Semanal | < 50% del total |
| Core Web Vitals | Vercel Analytics | Diario | LCP > 2.5s, CLS > 0.1 |
| Vendedores registrados | Dashboard admin | Semanal | < 10/semana |
| Productos publicados | Dashboard admin | Semanal | < 5/vendedor |
| CTR botón WhatsApp | Analytics propios | Semanal | < 20% |
