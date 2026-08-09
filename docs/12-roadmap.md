# 12 — Roadmap

## Visión General

```
Fase 1: MVP          Fase 2: Growth       Fase 3: Scale        Fase 4: SaaS
(0-3 meses)          (3-6 meses)          (6-12 meses)         (12+ meses)
┌────────────┐      ┌────────────┐      ┌────────────┐      ┌────────────┐
│ Catálogo   │      │ Crecimiento│      │ Monetización│     │ Plataforma │
│ inteligente│      │ y retención│      │ y features  │     │ SaaS full  │
│ + WhatsApp │      │            │      │ avanzadas   │     │            │
└────────────┘      └────────────┘      └────────────┘      └────────────┘
```

---

## Fase 1: MVP (Semanas 1-12)

### Objetivo: Validar producto-mercado

**Entregables:**
- Autenticación completa (email + Google)
- CRUD de negocios y productos
- Buscador con filtros y ordenamiento
- Página de producto con WhatsApp
- Favoritos
- Dashboard vendedor
- Panel admin básico
- PWA instalable
- SEO completo
- Tema claro/oscuro

**Métricas de éxito:**
- ≥ 50 vendedores registrados
- ≥ 250 productos publicados
- ≥ 1.000 visitantes únicos
- ≥ 30% CTR en botón WhatsApp
- ≥ 60% vendedores con 5+ productos

**Stack:** Next.js 15 + Supabase + TailwindCSS + Shadcn UI

---

## Fase 2: Growth (Meses 4-6)

### Objetivo: Crecer base de usuarios y mejorar retención

**Entregables:**
- Notificaciones push (PWA)
- Búsqueda con autocompletado y sugerencias
- Filtros avanzados (comuna dependiente, mapa)
- Sistema de reseñas y calificaciones de negocios
- Moderación de contenido activa
- Exportación de reportes
- Optimización de rendimiento (Core Web Vitals)
- A/B testing de landing page
- Email marketing (bienvenida, recordatorios)
- Compartir en redes sociales optimizado

**Métricas de éxito:**
- ≥ 200 vendedores activos
- ≥ 1.000 productos publicados
- ≥ 5.000 visitantes únicos/mes
- Retención de vendedores ≥ 70% mes 2
- NPS ≥ 40

---

## Fase 3: Scale (Meses 7-12)

### Objetivo: Monetizar y escalar

**Entregables:**
- **Planes SaaS:**
  - Free: hasta 10 productos, analíticas básicas
  - Pro: productos ilimitados, analíticas avanzadas, productos destacados
  - Business: todo + prioridad en búsqueda, badge verificado
- Sistema de pagos (Stripe / Mercado Pago)
- Badge de negocio verificado
- Priorización en búsqueda para planes pagos
- Analíticas avanzadas (embudos, conversión)
- API pública para integraciones
- App nativa (React Native / Expo) — opcional
- Multi-idioma (español, inglés, portugués)
- Búsqueda con ElasticSearch / Meilisearch
- CDN para imágenes

**Métricas de éxito:**
- ≥ 500 vendedores pagos
- MRR ≥ $5.000 USD
- Churn < 5% mensual
- ≥ 20.000 visitantes únicos/mes

---

## Fase 4: SaaS Full (Meses 12+)

### Objetivo: Plataforma completa

**Entregables:**
- Sistema de promociones y descuentos
- Programa de fidelización
- Publicidad y patrocinio de productos
- Carrito de compras (opcional, sin pagos)
- Integración con redes sociales (publicación automática)
- IA para recomendaciones de productos
- IA para moderación automática de contenido
- Dashboard avanzado con BI
- Webhooks para integraciones externas
- Multi-país
- App móvil nativa completa
- Marketplace de plugins/extensiones

**Métricas de éxito:**
- ≥ 2.000 vendedores pagos
- MRR ≥ $20.000 USD
- Expansión a 3+ países
- NPS ≥ 50

---

## Roadmap Visual

```
         Q1 2026          Q2 2026          Q3 2026          Q4 2026          2027+
      ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
      │   MVP    │    │  Growth  │    │  Scale   │    │ SaaS Full│    │ Expansión│
      │          │    │          │    │          │    │          │    │          │
      │ ✅ Auth  │    │ 🔔 Push  │    │ 💳 Pagos │    │ 🤖 IA    │    │ 🌍 Multi │
      │ ✅ CRUD  │    │ ⭐ Reseñas│   │ 📊 BI    │    │ 🛒 Cart  │    │ 📱 Native│
      │ ✅ Search│    │ 🗺️ Mapa  │    │ 🔌 API   │    │ 🎯 Ads   │    │ 🏪 Multi │
      │ ✅ PWA   │    │ 📧 Email │    │ 🌐 i18n  │    │ 🤝 Loyalty│   │  país    │
      │ ✅ SEO   │    │ 🧪 A/B   │    │ ⚡ Search│    │ 🔌 Webhk │    │          │
      └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
           │                │                │                │
         Validar         Crecer          Monetizar        Escalar
```

---

## Riesgos por Fase

| Fase | Riesgo Principal | Mitigación |
|---|---|---|
| MVP | Baja adopción de vendedores | Onboarding simplificado, importar desde WhatsApp |
| Growth | Churn de vendedores | Analíticas, feedback loops, features de retención |
| Scale | Complejidad de pagos | Stripe/Mercado Pago, empezar con un plan simple |
| SaaS Full | Scope creep | Priorizar features por revenue potential |
