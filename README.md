# 🛍️ Catáloga

> **Tu catálogo digital inteligente para WhatsApp.**  
> Descubre y vende productos de negocios locales con contacto directo por WhatsApp, sin intermediarios.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green?logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 🚀 Características Principales

- 🔍 **Buscador y Explorador:** Búsqueda en tiempo real por texto completo (Full-Text Search con GIN en PostgreSQL) y categorías.
- 📱 **Contacto Directo por WhatsApp:** Envío de mensajes automáticos con el nombre y enlace del producto pre-cargado.
- 🌎 **Soporte Multimoneda con Banderas:** Precios formateados en `VES 🇻🇪`, `PEN 🇵🇪`, `CLP 🇨🇱`, `COP 🇨🇴`, `USD 🇺🇸`, `MXN 🇲🇽`, `ARS 🇦🇷` y `EUR 🇪🇺`.
- 📲 **PWA Instalable:** Funciona como aplicación nativa en Android, iPhone y PC en menos de 2 MB, con detección inteligente que oculta banners al estar instalada.
- 🏪 **Panel de Vendedor:** Creación de catálogo, subida de hasta 5 imágenes por producto (máx. 2 MB) y estadísticas de visitas y clics.
- 🛡️ **Panel de Administración:** Moderación y gestión global de negocios, productos y categorías.
- 🔒 **Seguridad con RLS:** Row Level Security en todas las tablas de Supabase para aislamiento absoluto de datos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Estilos** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend & Base de Datos** | Supabase (PostgreSQL 15, Auth SSR, RLS, Storage) |
| **Validación** | Zod |
| **Despliegue** | Vercel (Producción y Previews automáticos) |

---

## 📂 Documentación Detallada

Para consultar la arquitectura técnica completa, esquema de base de datos, políticas de seguridad y mapa de rutas, revisa:

👉 **[`docs/ESTADO-DEL-SISTEMA.md`](docs/ESTADO-DEL-SISTEMA.md)**

---

## ⚙️ Configuración y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tylsonb/Cataloga-App.git
cd Cataloga-App
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Iniciar en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilación para producción
npm run start        # Iniciar servidor de producción compilado
npm run test         # Ejecutar suite de pruebas con Vitest
npm run type-check   # Verificación estricta de tipos TypeScript
```

---

## 📄 Licencia

Este proyecto es privado y propiedad de **Catáloga**. Todos los derechos reservados.

